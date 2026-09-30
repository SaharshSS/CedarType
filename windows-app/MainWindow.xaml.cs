using System.Collections.ObjectModel;
using System.IO;
using System.Text.Json;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Threading;
using Forms = System.Windows.Forms;

namespace CedarType.Windows;

public partial class MainWindow : System.Windows.Window
{
    private readonly Dictionary<string, LanguageProfile> _profiles;
    private readonly ObservableCollection<KeyRow> _rows = [];
    private readonly GlobalKeyboardHook _keyboardHook;
    private readonly Forms.NotifyIcon _trayIcon;
    private readonly string _settingsPath;
    private bool _ready;
    private bool _enabled;
    private bool _exiting;
    private string _language = "Lushootseed";
    private string _orthography = "";

    public MainWindow()
    {
        InitializeComponent();
        _settingsPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "CedarType", "settings.json");
        _profiles = LoadProfiles();
        _keyboardHook = new GlobalKeyboardHook(Dispatcher);
        _keyboardHook.OnStatus += text => StatusText.Text = text;
        _keyboardHook.OnFailure += error => StatusText.Text = $"Keyboard hook could not start: {error}";

        KeystrokesList.ItemsSource = _rows;
        var menu = new Forms.ContextMenuStrip();
        menu.Items.Add("Open CedarType", null, (_, _) => ShowWindow());
        menu.Items.Add("Turn typing on/off", null, (_, _) => Dispatcher.Invoke(ToggleTyping));
        menu.Items.Add(new Forms.ToolStripSeparator());
        menu.Items.Add("Exit CedarType", null, (_, _) => ExitApplication());
        _trayIcon = new Forms.NotifyIcon
        {
            Text = "CedarType",
            Icon = System.Drawing.SystemIcons.Application,
            ContextMenuStrip = menu,
            Visible = true
        };
        _trayIcon.DoubleClick += (_, _) => ShowWindow();

        LoadSavedSettings();
        PopulateLanguages();
        _ready = true;
        RefreshSelection();
        UpdateTypingState();
    }

    private Dictionary<string, LanguageProfile> LoadProfiles()
    {
        var path = Path.Combine(AppContext.BaseDirectory, "Resources", "LanguageProfiles.json");
        if (!File.Exists(path)) path = Path.Combine(AppContext.BaseDirectory, "LanguageProfiles.json");
        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<Dictionary<string, LanguageProfile>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
            ?? throw new InvalidDataException("The CedarType language profiles could not be read.");
    }

    private void LoadSavedSettings()
    {
        try
        {
            if (!File.Exists(_settingsPath)) return;
            var saved = JsonSerializer.Deserialize<SavedSettings>(File.ReadAllText(_settingsPath));
            if (saved is null) return;
            _language = saved.Language;
            _orthography = saved.Orthography;
            _enabled = saved.Enabled;
        }
        catch
        {
            _language = "Lushootseed";
            _orthography = "";
            _enabled = false;
        }
    }

    private void SaveSettings()
    {
        try
        {
            Directory.CreateDirectory(Path.GetDirectoryName(_settingsPath)!);
            File.WriteAllText(_settingsPath, JsonSerializer.Serialize(new SavedSettings
            {
                Language = _language,
                Orthography = _orthography,
                Enabled = _enabled
            }, new JsonSerializerOptions { WriteIndented = true }));
        }
        catch (Exception error)
        {
            StatusText.Text = $"Could not save CedarType settings: {error.Message}";
        }
    }

    private void PopulateLanguages()
    {
        LanguagePicker.ItemsSource = _profiles.Keys.OrderBy(x => x, StringComparer.CurrentCultureIgnoreCase).ToList();
        if (!_profiles.ContainsKey(_language)) _language = LanguagePicker.Items.Cast<string>().FirstOrDefault() ?? "Lushootseed";
        LanguagePicker.SelectedItem = _language;
    }

    private void RefreshSelection()
    {
        if (!_profiles.TryGetValue(_language, out var language)) return;
        var orthographies = language.Orthographies.Keys.OrderBy(x => x, StringComparer.CurrentCultureIgnoreCase).ToList();
        if (!orthographies.Contains(_orthography, StringComparer.Ordinal)) _orthography = orthographies.FirstOrDefault() ?? "";
        OrthographyPicker.ItemsSource = orthographies;
        OrthographyPicker.SelectedItem = _orthography;
        if (language.Orthographies.TryGetValue(_orthography, out var selected))
        {
            _keyboardHook.SetMappings(selected.Mappings);
            PopulateKeystrokes(selected);
        }
        SaveSettings();
    }

    private void PopulateKeystrokes(OrthographyProfile profile)
    {
        _rows.Clear();
        var rows = new Dictionary<string, string>(StringComparer.Ordinal);
        foreach (var key in profile.RegularLatin) rows[key] = key;
        foreach (var special in profile.Special)
            if (special.Length == 1 && special[0] <= 0x7f) rows[special] = special;
        foreach (var (key, output) in profile.Mappings) rows[key] = output;
        foreach (var (key, output) in rows.OrderBy(pair => pair.Key, StringComparer.CurrentCultureIgnoreCase))
            _rows.Add(new KeyRow(key, output));
    }

    private void LanguagePicker_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (!_ready || LanguagePicker.SelectedItem is not string language || language == _language) return;
        _language = language;
        _orthography = "";
        RefreshSelection();
    }

    private void OrthographyPicker_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (!_ready || OrthographyPicker.SelectedItem is not string orthography || orthography == _orthography) return;
        _orthography = orthography;
        RefreshSelection();
    }

    private void ToggleButton_Click(object sender, RoutedEventArgs e) => ToggleTyping();

    private void ToggleTyping()
    {
        _enabled = !_enabled;
        if (_enabled)
        {
            _keyboardHook.Start();
            StatusText.Text = "Typing is on. Type shortcut sequences in any app.";
        }
        else
        {
            _keyboardHook.Stop();
            StatusText.Text = "Typing is off.";
        }
        UpdateTypingState();
        SaveSettings();
    }

    private void UpdateTypingState()
    {
        ToggleButton.Content = _enabled ? "Turn CedarType Off" : "Turn CedarType On";
        if (_enabled) _keyboardHook.Start();
        else _keyboardHook.Stop();
    }

    private void KeystrokesTab_Selected(object sender, RoutedEventArgs e)
    {
        if (_ready) RefreshSelection();
    }

    private void Window_Closing(object? sender, System.ComponentModel.CancelEventArgs e)
    {
        if (_exiting) return;
        e.Cancel = true;
        Hide();
    }

    private void ShowWindow()
    {
        Dispatcher.Invoke(() =>
        {
            Show();
            WindowState = WindowState.Normal;
            Activate();
        });
    }

    private void ExitApplication()
    {
        Dispatcher.Invoke(() =>
        {
            _exiting = true;
            _keyboardHook.Dispose();
            _trayIcon.Visible = false;
            _trayIcon.Dispose();
            System.Windows.Application.Current.Shutdown();
        });
    }

    protected override void OnClosed(EventArgs e)
    {
        _keyboardHook.Dispose();
        _trayIcon.Dispose();
        base.OnClosed(e);
    }

    public sealed record KeyRow(string Keys, string Output);

    private sealed class SavedSettings
    {
        public SavedSettings() { }
        public string Language { get; set; } = "Lushootseed";
        public string Orthography { get; set; } = "";
        public bool Enabled { get; set; }
    }

    private sealed class LanguageProfile
    {
        public LanguageProfile() { }
        public string Code { get; set; } = "";
        public Dictionary<string, OrthographyProfile> Orthographies { get; set; } = [];
    }

    private sealed class OrthographyProfile
    {
        public OrthographyProfile() { }
        public Dictionary<string, string> Mappings { get; set; } = [];
        public List<string> RegularLatin { get; set; } = [];
        public List<string> Special { get; set; } = [];
    }
}
