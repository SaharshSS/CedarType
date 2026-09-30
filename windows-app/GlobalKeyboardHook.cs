using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Threading;

namespace CedarType.Windows;

internal sealed class GlobalKeyboardHook : IDisposable
{
    private const int WhKeyboardLl = 13;
    private const int WmKeyDown = 0x0100;
    private const int WmSysKeyDown = 0x0104;
    private const uint LlkhfInjected = 0x10;
    private const uint KeyeventfUnicode = 0x0004;
    private const uint KeyeventfKeyup = 0x0002;
    private const uint ToUnicodeNoStateChange = 0x0004;
    private readonly Dispatcher _dispatcher;
    private readonly DispatcherTimer _pendingTimer;
    private readonly HookProc _hookProc;
    private readonly HashSet<char> _allowedInput = [];
    private Dictionary<string, string> _mappings = new(StringComparer.Ordinal);
    private IntPtr _hook;
    private string _pending = "";
    private string _pendingOriginal = "";
    private bool _pendingCapitalized;
    private bool _disposed;

    public event Action<string>? OnStatus;
    public event Action<string>? OnFailure;

    public GlobalKeyboardHook(Dispatcher dispatcher)
    {
        _dispatcher = dispatcher;
        _hookProc = HookCallback;
        _pendingTimer = new DispatcherTimer(DispatcherPriority.Background, dispatcher)
        {
            Interval = TimeSpan.FromMilliseconds(650)
        };
        _pendingTimer.Tick += (_, _) => FlushPending();
    }

    public void SetMappings(Dictionary<string, string> mappings)
    {
        _dispatcher.VerifyAccess();
        _mappings = new Dictionary<string, string>(mappings, StringComparer.Ordinal);
        _allowedInput.Clear();
        foreach (var key in _mappings.Keys)
            foreach (var character in key)
                if (character <= 0x7f) _allowedInput.Add(char.ToLowerInvariant(character));
        ResetPending();
    }

    public void Start()
    {
        _dispatcher.VerifyAccess();
        if (_disposed || _hook != IntPtr.Zero) return;
        _hook = SetWindowsHookEx(WhKeyboardLl, _hookProc, GetModuleHandle(null), 0);
        if (_hook == IntPtr.Zero)
        {
            var error = Marshal.GetLastWin32Error();
            OnFailure?.Invoke($"Windows rejected the keyboard hook (error {error}).");
            OnStatus?.Invoke("CedarType could not start keyboard monitoring.");
            return;
        }
        OnStatus?.Invoke("Typing is on. Type shortcut sequences in any app.");
    }

    public void Stop()
    {
        _dispatcher.VerifyAccess();
        FlushPending();
        if (_hook == IntPtr.Zero) return;
        UnhookWindowsHookEx(_hook);
        _hook = IntPtr.Zero;
    }

    private IntPtr HookCallback(int code, IntPtr wParam, IntPtr lParam)
    {
        if (code < 0) return CallNextHookEx(_hook, code, wParam, lParam);
        try
        {
            var message = wParam.ToInt32();
            var key = Marshal.PtrToStructure<KbdLlHookStruct>(lParam);
            if ((message != WmKeyDown && message != WmSysKeyDown) || (key.Flags & LlkhfInjected) != 0)
                return CallNextHookEx(_hook, code, wParam, lParam);

            if (IsPressed(0x11) || IsPressed(0x12) || IsPressed(0x5B) || IsPressed(0x5C))
            {
                FlushPending();
                return CallNextHookEx(_hook, code, wParam, lParam);
            }

            var character = GetTypedCharacter(key);
            if (character is null)
            {
                FlushPending();
                return CallNextHookEx(_hook, code, wParam, lParam);
            }
            if (!HandleCharacter(character.Value)) return CallNextHookEx(_hook, code, wParam, lParam);
            return new IntPtr(1);
        }
        catch (Exception error)
        {
            OnFailure?.Invoke(error.Message);
            FlushPending();
            return CallNextHookEx(_hook, code, wParam, lParam);
        }
    }

    private bool HandleCharacter(char originalCharacter)
    {
        var normalized = char.ToLowerInvariant(originalCharacter);
        if (!_allowedInput.Contains(normalized))
        {
            if (_pending.Length == 0) return false;
            var combined = _pending + normalized;
            var original = _pendingOriginal + originalCharacter;
            var capitalize = _pendingCapitalized;
            ResetPending();
            Post(Resolve(combined, original, allowWait: true, capitalize));
            return true;
        }

        var value = normalized.ToString();
        var combinedText = _pending + value;
        var combinedOriginal = _pendingOriginal + originalCharacter;
        var capitalizeFirst = _pending.Length == 0 ? char.IsUpper(originalCharacter) : _pendingCapitalized;
        var exact = _mappings.TryGetValue(combinedText, out var exactOutput);
        var hasContinuation = _mappings.Keys.Any(candidate => candidate.Length > combinedText.Length && candidate.StartsWith(combinedText, StringComparison.Ordinal));
        if (exact && !hasContinuation)
        {
            ResetPending();
            Post(Capitalize(exactOutput!, capitalizeFirst));
            return true;
        }

        if (_mappings.Keys.Any(candidate => candidate.StartsWith(combinedText, StringComparison.Ordinal)))
        {
            _pending = combinedText;
            _pendingOriginal = combinedOriginal;
            if (_pending.Length == 1) _pendingCapitalized = char.IsUpper(originalCharacter);
            _pendingTimer.Stop();
            _pendingTimer.Start();
            return true;
        }

        if (_pending.Length == 0) return false;
        ResetPending();
        Post(Resolve(combinedText, combinedOriginal, allowWait: true, capitalizeFirst));
        return true;
    }

    private string Resolve(string text, string original, bool allowWait, bool capitalizeFirst)
    {
        var remainder = text;
        var originalRemainder = original;
        var output = new StringBuilder();
        var mayCapitalize = capitalizeFirst;
        while (remainder.Length > 0)
        {
            if (allowWait && _mappings.Keys.Any(key => key.StartsWith(remainder, StringComparison.Ordinal)))
            {
                _pending = remainder;
                _pendingOriginal = originalRemainder;
                _pendingCapitalized = mayCapitalize;
                _pendingTimer.Stop();
                _pendingTimer.Start();
                break;
            }

            var match = _mappings.Keys
                .Where(key => remainder.StartsWith(key, StringComparison.Ordinal))
                .OrderByDescending(key => key.Length)
                .FirstOrDefault();
            if (match is not null)
            {
                output.Append(Capitalize(_mappings[match], mayCapitalize));
                mayCapitalize = false;
                remainder = remainder[match.Length..];
                originalRemainder = originalRemainder[match.Length..];
            }
            else
            {
                output.Append(originalRemainder[0]);
                remainder = remainder[1..];
                originalRemainder = originalRemainder[1..];
                mayCapitalize = false;
            }
        }
        return output.ToString();
    }

    private void FlushPending()
    {
        _pendingTimer.Stop();
        if (_pending.Length == 0) return;
        var text = _pending;
        var original = _pendingOriginal;
        var capitalize = _pendingCapitalized;
        ResetPending();
        Post(Resolve(text, original, allowWait: false, capitalize));
    }

    private void ResetPending()
    {
        _pendingTimer.Stop();
        _pending = "";
        _pendingOriginal = "";
        _pendingCapitalized = false;
    }

    private static string Capitalize(string text, bool capitalize)
    {
        if (!capitalize || text.Length == 0) return text;
        return char.ToUpperInvariant(text[0]) + text[1..];
    }

    private static char? GetTypedCharacter(KbdLlHookStruct key)
    {
        var state = new byte[256];
        if (!GetKeyboardState(state)) return null;
        var foreground = GetForegroundWindow();
        var thread = GetWindowThreadProcessId(foreground, out _);
        var layout = GetKeyboardLayout(thread);
        var buffer = new StringBuilder(8);
        var result = ToUnicodeEx(key.VirtualKey, key.ScanCode, state, buffer, buffer.Capacity, ToUnicodeNoStateChange, layout);
        if (result != 1) return null;
        var character = buffer[0];
        return character <= 0x7f ? character : null;
    }

    private static bool IsPressed(int virtualKey) => (GetAsyncKeyState(virtualKey) & 0x8000) != 0;

    private static void Post(string text)
    {
        if (text.Length == 0) return;
        var input = new List<Input>(text.Length * 2);
        foreach (var character in text)
        {
            input.Add(Input.Unicode(character, KeyeventfUnicode));
            input.Add(Input.Unicode(character, KeyeventfUnicode | KeyeventfKeyup));
        }
        SendInput((uint)input.Count, input.ToArray(), Marshal.SizeOf<Input>());
    }

    public void Dispose()
    {
        if (_disposed) return;
        Stop();
        _disposed = true;
    }

    private delegate IntPtr HookProc(int code, IntPtr wParam, IntPtr lParam);

    [StructLayout(LayoutKind.Sequential)]
    private struct KbdLlHookStruct
    {
        public uint VirtualKey;
        public uint ScanCode;
        public uint Flags;
        public uint Time;
        public UIntPtr ExtraInfo;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct Input
    {
        public uint Type;
        public InputUnion Data;
        public static Input Unicode(char character, uint flags) => new()
        {
            Type = 1,
            Data = new InputUnion { Keyboard = new KeyboardInput { ScanCode = character, Flags = flags } }
        };
    }

    [StructLayout(LayoutKind.Explicit)]
    private struct InputUnion
    {
        [FieldOffset(0)] public KeyboardInput Keyboard;
        [FieldOffset(0)] public MouseInput Mouse;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct KeyboardInput
    {
        public ushort VirtualKey;
        public ushort ScanCode;
        public uint Flags;
        public uint Time;
        public UIntPtr ExtraInfo;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct MouseInput
    {
        public int X;
        public int Y;
        public uint Data;
        public uint Flags;
        public uint Time;
        public UIntPtr ExtraInfo;
    }

    [DllImport("user32.dll", SetLastError = true)] private static extern IntPtr SetWindowsHookEx(int idHook, HookProc callback, IntPtr module, uint threadId);
    [DllImport("user32.dll", SetLastError = true)] [return: MarshalAs(UnmanagedType.Bool)] private static extern bool UnhookWindowsHookEx(IntPtr hook);
    [DllImport("user32.dll")] private static extern IntPtr CallNextHookEx(IntPtr hook, int code, IntPtr wParam, IntPtr lParam);
    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)] private static extern IntPtr GetModuleHandle(string? moduleName);
    [DllImport("user32.dll")] private static extern short GetAsyncKeyState(int virtualKey);
    [DllImport("user32.dll", SetLastError = true)] [return: MarshalAs(UnmanagedType.Bool)] private static extern bool GetKeyboardState(byte[] state);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] private static extern int ToUnicodeEx(uint virtualKey, uint scanCode, byte[] keyState, StringBuilder buffer, int bufferLength, uint flags, IntPtr keyboardLayout);
    [DllImport("user32.dll")] private static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] private static extern uint GetWindowThreadProcessId(IntPtr window, out uint processId);
    [DllImport("user32.dll")] private static extern IntPtr GetKeyboardLayout(uint threadId);
    [DllImport("user32.dll", SetLastError = true)] private static extern uint SendInput(uint inputCount, Input[] inputs, int inputSize);
}
