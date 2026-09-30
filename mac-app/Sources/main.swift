import AppKit
import ApplicationServices
import Carbon.HIToolbox

@main
enum CedarTypeDesktop {
    private static var delegate: AppDelegate?

    static func main() {
        let app = NSApplication.shared
        delegate = AppDelegate()
        app.delegate = delegate
        app.setActivationPolicy(.regular)
        app.run()
    }
}

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var utility: CedarTypeUtility?
    private var controlWindow: NSWindow?
    private var languagePicker: NSPopUpButton?
    private var orthographyPicker: NSPopUpButton?
    private var typingButton: NSButton?
    private var statusLabel: NSTextField?
    private var tabControl: NSSegmentedControl?
    private var typingView: NSView?
    private var keystrokesView: NSView?
    private var keystrokesList: NSStackView?

    func applicationDidFinishLaunching(_ notification: Notification) {
        utility = CedarTypeUtility()
        utility?.onChange = { [weak self] in self?.updateControls() }
        utility?.start()
        showControlWindow()
        updateControls()
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        false
    }

    private func showControlWindow() {
        let window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 560, height: 560),
            styleMask: [.titled, .closable, .miniaturizable],
            backing: .buffered,
            defer: false
        )
        window.title = "CedarType"
        window.center()

        let heading = NSTextField(labelWithString: "Type CedarType characters in any app")
        heading.font = .boldSystemFont(ofSize: 18)
        let detail = NSTextField(wrappingLabelWithString: "Choose a language and orthography. When typing is on, CedarType replaces mapped sequences directly in the app you are using.")
        detail.font = .systemFont(ofSize: 13)
        let languagePicker = NSPopUpButton(frame: .zero, pullsDown: false)
        languagePicker.target = self
        languagePicker.action = #selector(languageChanged(_:))
        let orthographyPicker = NSPopUpButton(frame: .zero, pullsDown: false)
        orthographyPicker.target = self
        orthographyPicker.action = #selector(orthographyChanged(_:))
        let typingButton = NSButton(title: "Turn CedarType On", target: self, action: #selector(toggleTyping))
        typingButton.bezelStyle = .rounded
        let statusLabel = NSTextField(wrappingLabelWithString: "Typing is off")
        statusLabel.font = .systemFont(ofSize: 12)
        let inputPermission = NSButton(title: "Open Input Monitoring Settings…", target: utility, action: #selector(CedarTypeUtility.openInputMonitoringSettings))
        let accessibilityPermission = NSButton(title: "Open Accessibility Settings…", target: utility, action: #selector(CedarTypeUtility.openAccessibilitySettings))
        inputPermission.bezelStyle = .rounded
        accessibilityPermission.bezelStyle = .rounded

        let container = NSView()
        let header = NSStackView(views: [heading, detail, labeled("Language", picker: languagePicker), labeled("Orthography", picker: orthographyPicker)])
        header.orientation = .vertical
        header.alignment = .leading
        header.spacing = 10
        header.translatesAutoresizingMaskIntoConstraints = false
        let tabs = NSSegmentedControl(labels: ["Typing", "Keystrokes"], trackingMode: .selectOne, target: self, action: #selector(tabChanged(_:)))
        tabs.selectedSegment = 0
        tabs.translatesAutoresizingMaskIntoConstraints = false

        let typingView = NSStackView(views: [typingButton, statusLabel, inputPermission, accessibilityPermission])
        typingView.orientation = .vertical
        typingView.alignment = .leading
        typingView.spacing = 12
        typingView.translatesAutoresizingMaskIntoConstraints = false

        let keystrokesList = NSStackView()
        keystrokesList.orientation = .vertical
        keystrokesList.alignment = .leading
        keystrokesList.spacing = 4
        keystrokesList.translatesAutoresizingMaskIntoConstraints = false
        let scroll = NSScrollView()
        scroll.hasVerticalScroller = true
        scroll.borderType = .bezelBorder
        scroll.documentView = keystrokesList
        scroll.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            keystrokesList.leadingAnchor.constraint(equalTo: scroll.contentView.leadingAnchor, constant: 10),
            keystrokesList.trailingAnchor.constraint(equalTo: scroll.contentView.trailingAnchor, constant: -10),
            keystrokesList.topAnchor.constraint(equalTo: scroll.contentView.topAnchor, constant: 10),
            keystrokesList.widthAnchor.constraint(equalTo: scroll.contentView.widthAnchor, constant: -20)
        ])
        let keystrokesView = NSView()
        keystrokesView.isHidden = true
        keystrokesView.translatesAutoresizingMaskIntoConstraints = false
        let keystrokesStack = NSStackView(views: [NSTextField(labelWithString: "Available keys for the selected language and orthography"), scroll])
        keystrokesStack.orientation = .vertical
        keystrokesStack.alignment = .leading
        keystrokesStack.spacing = 10
        keystrokesStack.translatesAutoresizingMaskIntoConstraints = false
        keystrokesView.addSubview(keystrokesStack)
        NSLayoutConstraint.activate([
            keystrokesStack.leadingAnchor.constraint(equalTo: keystrokesView.leadingAnchor),
            keystrokesStack.trailingAnchor.constraint(equalTo: keystrokesView.trailingAnchor),
            keystrokesStack.topAnchor.constraint(equalTo: keystrokesView.topAnchor),
            keystrokesStack.bottomAnchor.constraint(equalTo: keystrokesView.bottomAnchor),
            keystrokesStack.widthAnchor.constraint(equalTo: keystrokesView.widthAnchor),
            scroll.heightAnchor.constraint(greaterThanOrEqualToConstant: 280)
        ])

        container.addSubview(header)
        container.addSubview(tabs)
        container.addSubview(typingView)
        container.addSubview(keystrokesView)
        NSLayoutConstraint.activate([
            header.leadingAnchor.constraint(equalTo: container.leadingAnchor, constant: 24),
            header.trailingAnchor.constraint(equalTo: container.trailingAnchor, constant: -24),
            header.topAnchor.constraint(equalTo: container.topAnchor, constant: 20),
            tabs.leadingAnchor.constraint(equalTo: header.leadingAnchor),
            tabs.topAnchor.constraint(equalTo: header.bottomAnchor, constant: 16),
            tabs.widthAnchor.constraint(equalToConstant: 240),
            typingView.leadingAnchor.constraint(equalTo: header.leadingAnchor),
            typingView.trailingAnchor.constraint(equalTo: header.trailingAnchor),
            typingView.topAnchor.constraint(equalTo: tabs.bottomAnchor, constant: 16),
            keystrokesView.leadingAnchor.constraint(equalTo: header.leadingAnchor),
            keystrokesView.trailingAnchor.constraint(equalTo: header.trailingAnchor),
            keystrokesView.topAnchor.constraint(equalTo: tabs.bottomAnchor, constant: 16),
            keystrokesView.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -20)
        ])
        window.contentView = container
        controlWindow = window
        self.languagePicker = languagePicker
        self.orthographyPicker = orthographyPicker
        self.typingButton = typingButton
        self.statusLabel = statusLabel
        self.tabControl = tabs
        self.typingView = typingView
        self.keystrokesView = keystrokesView
        self.keystrokesList = keystrokesList
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    private func labeled(_ title: String, picker: NSPopUpButton) -> NSView {
        let label = NSTextField(labelWithString: title)
        label.setContentHuggingPriority(.required, for: .horizontal)
        picker.widthAnchor.constraint(greaterThanOrEqualToConstant: 250).isActive = true
        let row = NSStackView(views: [label, picker])
        row.orientation = .horizontal
        row.alignment = .centerY
        row.spacing = 14
        return row
    }

    private func updateControls() {
        guard let utility else { return }
        languagePicker?.removeAllItems()
        languagePicker?.addItems(withTitles: utility.languageNames)
        languagePicker?.selectItem(withTitle: utility.currentLanguage)
        orthographyPicker?.removeAllItems()
        orthographyPicker?.addItems(withTitles: utility.orthographyNames)
        orthographyPicker?.selectItem(withTitle: utility.currentOrthography ?? "")
        typingButton?.title = utility.isEnabled ? "Turn CedarType Off" : "Turn CedarType On"
        statusLabel?.stringValue = utility.statusText
        updateKeystrokes()
    }

    @objc private func tabChanged(_ sender: NSSegmentedControl) {
        let showingKeystrokes = sender.selectedSegment == 1
        typingView?.isHidden = showingKeystrokes
        keystrokesView?.isHidden = !showingKeystrokes
        if showingKeystrokes { updateKeystrokes() }
    }

    private func updateKeystrokes() {
        guard let keystrokesList, let utility else { return }
        for view in keystrokesList.arrangedSubviews {
            keystrokesList.removeArrangedSubview(view)
            view.removeFromSuperview()
        }
        for (keys, output) in utility.keystrokeRows {
            let keyLabel = NSTextField(labelWithString: keys)
            keyLabel.font = .monospacedSystemFont(ofSize: 13, weight: .medium)
            keyLabel.setContentHuggingPriority(.required, for: .horizontal)
            keyLabel.widthAnchor.constraint(equalToConstant: 150).isActive = true
            let arrow = NSTextField(labelWithString: "→")
            arrow.textColor = .secondaryLabelColor
            let outputLabel = NSTextField(labelWithString: output)
            outputLabel.font = .monospacedSystemFont(ofSize: 14, weight: .regular)
            let row = NSStackView(views: [keyLabel, arrow, outputLabel])
            row.orientation = .horizontal
            row.alignment = .centerY
            row.spacing = 12
            keystrokesList.addArrangedSubview(row)
        }
    }

    @objc private func languageChanged(_ sender: NSPopUpButton) {
        guard let title = sender.titleOfSelectedItem else { return }
        utility?.chooseLanguage(title)
    }

    @objc private func orthographyChanged(_ sender: NSPopUpButton) {
        guard let title = sender.titleOfSelectedItem else { return }
        utility?.chooseOrthography(title)
    }

    @objc private func toggleTyping() {
        utility?.toggleTyping()
    }
}

private struct LanguageProfiles: Decodable {
    struct Language: Decodable {
        let orthographies: [String: Orthography]
    }

    struct Orthography: Decodable {
        let mappings: [String: String]
        let regularLatin: [String]
        let special: [String]
    }

    let languages: [String: Language]

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        languages = try container.decode([String: Language].self)
    }
}

private final class CedarTypeUtility: NSObject {
    private let statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
    private let engine = TransliterationEngine()
    private var selectedLanguage = UserDefaults.standard.string(forKey: "language") ?? "Lushootseed"
    private var selectedOrthography = UserDefaults.standard.string(forKey: "orthography")
    private var enabled = UserDefaults.standard.bool(forKey: "enabled")
    private var profiles: LanguageProfiles?
    private var permissionsReady = false
    private var inputMonitoringAllowed = false
    private var accessibilityAllowed = false
    private var postEventsAllowed = false
    private var eventTapStarted = false
    var onChange: (() -> Void)?

    var languageNames: [String] { profiles?.languages.keys.sorted() ?? [] }
    var orthographyNames: [String] { profiles?.languages[selectedLanguage]?.orthographies.keys.sorted() ?? [] }
    var currentLanguage: String { selectedLanguage }
    var currentOrthography: String? { selectedOrthography }
    var isEnabled: Bool { enabled }
    var keystrokeRows: [(String, String)] {
        guard let selectedOrthography,
              let orthography = profiles?.languages[selectedLanguage]?.orthographies[selectedOrthography] else { return [] }
        var rows = Dictionary(uniqueKeysWithValues: orthography.regularLatin.map { ($0, $0) })
        for character in orthography.special where character.utf8.count == 1 && character.unicodeScalars.first?.isASCII == true {
            rows[character] = character
        }
        for (key, output) in orthography.mappings { rows[key] = output }
        return rows.sorted { $0.key.localizedStandardCompare($1.key) == .orderedAscending }
    }
    var statusText: String {
        if !enabled { return "Typing is off. Turn it on to use CedarType in other apps." }
        if permissionsReady { return "Typing is on. Latin sequences will be replaced as you type." }
        var missing: [String] = []
        if !inputMonitoringAllowed { missing.append("Input Monitoring") }
        if !accessibilityAllowed { missing.append("Accessibility") }
        if !postEventsAllowed { missing.append("keyboard event access") }
        if !missing.isEmpty {
            return "CedarType cannot type yet. macOS reports missing: \(missing.joined(separator: ", ")). Recheck access, then turn typing off and on."
        }
        if !eventTapStarted {
            return "Permissions are granted, but macOS did not start CedarType’s keyboard monitor. Quit and reopen CedarType, then check its Input Monitoring entry."
        }
        return "CedarType is not ready. Turn typing off and on again."
    }

    func start() {
        loadProfiles()
        if let button = statusItem.button {
            button.title = "CedarType"
        }
        refreshMenu()
        if enabled {
            refreshPermissions(request: false)
            updateTypingReadiness()
        }
    }

    private func loadProfiles() {
        guard let url = Bundle.main.url(forResource: "LanguageProfiles", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let decoded = try? JSONDecoder().decode(LanguageProfiles.self, from: data) else {
            return
        }
        profiles = decoded
        if decoded.languages[selectedLanguage] == nil {
            selectedLanguage = decoded.languages.keys.sorted().first ?? "Lushootseed"
        }
        let orthographies = decoded.languages[selectedLanguage]?.orthographies.keys.sorted() ?? []
        if !orthographies.contains(selectedOrthography ?? "") {
            selectedOrthography = orthographies.first
        }
        applySelection()
    }

    private func applySelection() {
        guard let selectedOrthography,
              let mappings = profiles?.languages[selectedLanguage]?.orthographies[selectedOrthography]?.mappings else {
            return
        }
        engine.mappings = mappings
        UserDefaults.standard.set(selectedLanguage, forKey: "language")
        UserDefaults.standard.set(selectedOrthography, forKey: "orthography")
    }

    private func refreshMenu() {
        let menu = NSMenu()
        let toggle = NSMenuItem(title: enabled ? "Turn CedarType Off" : "Turn CedarType On", action: #selector(toggleEnabled), keyEquivalent: "")
        toggle.target = self
        menu.addItem(toggle)

        let status = !enabled
            ? "Typing is off"
            : statusText
        let typingState = NSMenuItem(title: status, action: nil, keyEquivalent: "")
        typingState.isEnabled = false
        menu.addItem(typingState)
        menu.addItem(.separator())

        let languageMenu = NSMenu()
        for language in (profiles?.languages.keys.sorted() ?? []) {
            let item = NSMenuItem(title: language, action: nil, keyEquivalent: "")
            let orthographyMenu = NSMenu()
            for orthography in (profiles?.languages[language]?.orthographies.keys.sorted() ?? []) {
                let choice = NSMenuItem(title: orthography, action: #selector(selectOrthography(_:)), keyEquivalent: "")
                choice.target = self
                choice.representedObject = [language, orthography]
                choice.state = language == selectedLanguage && orthography == selectedOrthography ? .on : .off
                orthographyMenu.addItem(choice)
            }
            item.submenu = orthographyMenu
            languageMenu.addItem(item)
        }
        let languageItem = NSMenuItem(title: "Language & Orthography", action: nil, keyEquivalent: "")
        languageItem.submenu = languageMenu
        menu.addItem(languageItem)
        menu.addItem(.separator())

        addSettingsItem("Allow CedarType in other apps…", action: #selector(openAccessibilitySettings), to: menu)
        addSettingsItem("Allow keyboard monitoring…", action: #selector(openInputMonitoringSettings), to: menu)
        menu.addItem(.separator())
        addSettingsItem("Quit CedarType", action: #selector(quit), to: menu)
        statusItem.menu = menu
    }

    private func addSettingsItem(_ title: String, action: Selector, to menu: NSMenu) {
        let item = NSMenuItem(title: title, action: action, keyEquivalent: "")
        item.target = self
        menu.addItem(item)
    }

    @objc fileprivate func toggleEnabled() {
        toggleTyping()
    }

    func toggleTyping() {
        enabled.toggle()
        UserDefaults.standard.set(enabled, forKey: "enabled")
        if enabled {
            applySelection()
            refreshPermissions(request: true)
            updateTypingReadiness()
        } else {
            engine.stop()
            permissionsReady = false
        }
        refreshMenu()
        onChange?()
    }

    private func refreshPermissions(request: Bool) {
        inputMonitoringAllowed = CGPreflightListenEventAccess()
        if request && !inputMonitoringAllowed {
            inputMonitoringAllowed = CGRequestListenEventAccess()
        }

        postEventsAllowed = CGPreflightPostEventAccess()
        if request && !postEventsAllowed {
            postEventsAllowed = CGRequestPostEventAccess()
        }

        accessibilityAllowed = AXIsProcessTrusted()
        if request && !accessibilityAllowed {
            let options = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true] as CFDictionary
            accessibilityAllowed = AXIsProcessTrustedWithOptions(options)
        }
    }

    private func updateTypingReadiness() {
        // Do not AND into the previous readiness value: it starts false and
        // would keep CedarType reporting missing permissions forever.
        eventTapStarted = false
        guard inputMonitoringAllowed, accessibilityAllowed, postEventsAllowed else {
            engine.stop()
            permissionsReady = false
            NSLog("CedarType permission status: input=%@ accessibility=%@ post=%@", String(inputMonitoringAllowed), String(accessibilityAllowed), String(postEventsAllowed))
            return
        }
        eventTapStarted = engine.start()
        permissionsReady = eventTapStarted
        NSLog("CedarType keyboard monitor started=%@", String(eventTapStarted))
    }

    @objc private func selectOrthography(_ sender: NSMenuItem) {
        guard let choice = sender.representedObject as? [String], choice.count == 2 else { return }
        selectedLanguage = choice[0]
        selectedOrthography = choice[1]
        applySelection()
        refreshMenu()
        onChange?()
    }

    func chooseLanguage(_ language: String) {
        guard profiles?.languages[language] != nil else { return }
        selectedLanguage = language
        selectedOrthography = profiles?.languages[language]?.orthographies.keys.sorted().first
        applySelection()
        refreshMenu()
        onChange?()
    }

    func chooseOrthography(_ orthography: String) {
        guard profiles?.languages[selectedLanguage]?.orthographies[orthography] != nil else { return }
        selectedOrthography = orthography
        applySelection()
        refreshMenu()
        onChange?()
    }

    @objc fileprivate func openAccessibilitySettings() {
        let options = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true] as CFDictionary
        _ = AXIsProcessTrustedWithOptions(options)
        NSWorkspace.shared.open(URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility")!)
    }

    @objc fileprivate func openInputMonitoringSettings() {
        NSWorkspace.shared.open(URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_ListenEvent")!)
    }

    @objc private func quit() {
        NSApp.terminate(nil)
    }
}

private final class TransliterationEngine {
    var mappings: [String: String] = [:] {
        didSet {
            allowedInputCharacters = Set(mappings.keys.flatMap { $0.unicodeScalars })
        }
    }
    private var allowedInputCharacters = Set<Unicode.Scalar>()
    private var eventTap: CFMachPort?
    private var runLoopSource: CFRunLoopSource?
    private var pending = ""
    private var pendingOriginal = ""
    private var pendingCapitalized = false
    private var pendingTimer: Timer?
    private let marker: Int64 = 0x4345444152545950

    func start() -> Bool {
        guard eventTap == nil else { return true }
        let mask = CGEventMask(1) << CGEventType.keyDown.rawValue
        let callback: CGEventTapCallBack = { proxy, type, event, refcon in
            guard let refcon else { return Unmanaged.passUnretained(event) }
            let engine = Unmanaged<TransliterationEngine>.fromOpaque(refcon).takeUnretainedValue()
            return engine.handle(proxy: proxy, type: type, event: event)
        }
        guard let tap = CGEvent.tapCreate(
            tap: .cgSessionEventTap,
            place: .headInsertEventTap,
            options: .defaultTap,
            eventsOfInterest: mask,
            callback: callback,
            userInfo: Unmanaged.passUnretained(self).toOpaque()
        ) else {
            NSLog("CedarType CGEvent.tapCreate failed")
            return false
        }
        eventTap = tap
        runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0)
        if let runLoopSource {
            CFRunLoopAddSource(CFRunLoopGetMain(), runLoopSource, .commonModes)
        }
        CGEvent.tapEnable(tap: tap, enable: true)
        guard CGEvent.tapIsEnabled(tap: tap) else {
            NSLog("CedarType event tap was not enabled")
            stop()
            return false
        }
        return true
    }

    func stop() {
        flushPending()
        if let eventTap { CGEvent.tapEnable(tap: eventTap, enable: false) }
        if let runLoopSource { CFRunLoopRemoveSource(CFRunLoopGetMain(), runLoopSource, .commonModes) }
        eventTap = nil
        runLoopSource = nil
    }

    private func handle(proxy: CGEventTapProxy, type: CGEventType, event: CGEvent) -> Unmanaged<CGEvent>? {
        if type == .tapDisabledByTimeout || type == .tapDisabledByUserInput {
            if let eventTap { CGEvent.tapEnable(tap: eventTap, enable: true) }
            return Unmanaged.passUnretained(event)
        }
        guard type == .keyDown,
              event.getIntegerValueField(.eventSourceUserData) != marker else {
            return Unmanaged.passUnretained(event)
        }

        let flags = event.flags
        if flags.contains(.maskCommand) || flags.contains(.maskControl) || flags.contains(.maskAlternate) {
            flushPending()
            return Unmanaged.passUnretained(event)
        }

        let characters = Self.characters(from: event)
        guard characters.count == 1, let scalar = characters.unicodeScalars.first else {
            flushPending()
            return Unmanaged.passUnretained(event)
        }
        let value = String(scalar)
        let normalized = flags.contains(.maskShift) || flags.contains(.maskAlphaShift) ? value.lowercased() : value
        guard normalized.unicodeScalars.count == 1,
              let normalizedScalar = normalized.unicodeScalars.first,
              normalizedScalar.isASCII,
              allowedInputCharacters.contains(normalizedScalar) else {
            if pending.isEmpty { return Unmanaged.passUnretained(event) }
            let output = resolve(pending, original: pendingOriginal, allowWait: false, capitalizeFirstMapping: pendingCapitalized) + value
            resetPending()
            event.keyboardSetUnicodeString(stringLength: output.utf16.count, unicodeString: Array(output.utf16))
            return Unmanaged.passUnretained(event)
        }

        let wasShifted = value != value.lowercased()
        let incoming = normalized.lowercased()
        let combined = pending + incoming
        let combinedOriginal = pendingOriginal + value
        let capitalizeMapping = pending.isEmpty ? wasShifted : pendingCapitalized
        let hasContinuation = mappings.keys.contains { $0.hasPrefix(combined) && $0 != combined }
        if mappings[combined] != nil && !hasContinuation {
            let replacement = mappings[combined] ?? combined
            let output = capitalizeMapping ? replacement.capitalized : replacement
            resetPending()
            event.keyboardSetUnicodeString(stringLength: output.utf16.count, unicodeString: Array(output.utf16))
            return Unmanaged.passUnretained(event)
        }
        if mappings.keys.contains(where: { $0.hasPrefix(combined) }) {
            pending = combined
            pendingOriginal = combinedOriginal
            if pendingOriginal.count == incoming.count { pendingCapitalized = wasShifted }
            scheduleFlush()
            return nil
        }

        if pending.isEmpty { return Unmanaged.passUnretained(event) }
        resetPending()
        let output = resolve(combined, original: combinedOriginal, allowWait: true, capitalizeFirstMapping: capitalizeMapping)
        pendingTimer?.invalidate()
        if output.isEmpty { return nil }
        event.keyboardSetUnicodeString(stringLength: output.utf16.count, unicodeString: Array(output.utf16))
        return Unmanaged.passUnretained(event)
    }

    private func resolve(_ text: String, original: String, allowWait: Bool, capitalizeFirstMapping: Bool) -> String {
        var remainder = text
        var originalRemainder = original
        var output = ""
        var mayCapitalizeMapping = capitalizeFirstMapping
        while !remainder.isEmpty {
            if allowWait && mappings.keys.contains(where: { $0.hasPrefix(remainder) }) {
                pending = remainder
                pendingOriginal = originalRemainder
                pendingCapitalized = mayCapitalizeMapping
                scheduleFlush()
                break
            }
            let match = mappings.keys
                .filter { remainder.hasPrefix($0) }
                .max { $0.count < $1.count }
            if let match, let replacement = mappings[match] {
                output += mayCapitalizeMapping ? replacement.capitalized : replacement
                mayCapitalizeMapping = false
                remainder.removeFirst(match.count)
                originalRemainder.removeFirst(match.count)
            } else {
                _ = remainder.removeFirst()
                output.append(originalRemainder.removeFirst())
                mayCapitalizeMapping = false
            }
        }
        return output
    }

    private func scheduleFlush() {
        pendingTimer?.invalidate()
        pendingTimer = Timer.scheduledTimer(withTimeInterval: 0.65, repeats: false) { [weak self] _ in
            self?.flushPending()
        }
    }

    private func flushPending() {
        pendingTimer?.invalidate()
        pendingTimer = nil
        guard !pending.isEmpty else { return }
        let output = resolve(pending, original: pendingOriginal, allowWait: false, capitalizeFirstMapping: pendingCapitalized)
        resetPending()
        post(output)
    }

    private func resetPending() {
        pending = ""
        pendingOriginal = ""
        pendingCapitalized = false
        pendingTimer?.invalidate()
        pendingTimer = nil
    }

    private func post(_ text: String) {
        guard !text.isEmpty, let source = CGEventSource(stateID: .combinedSessionState),
              let event = CGEvent(keyboardEventSource: source, virtualKey: 0, keyDown: true) else { return }
        event.setIntegerValueField(.eventSourceUserData, value: marker)
        event.keyboardSetUnicodeString(stringLength: text.utf16.count, unicodeString: Array(text.utf16))
        event.post(tap: .cgSessionEventTap)
    }

    private static func characters(from event: CGEvent) -> String {
        var length = 0
        var buffer = [UniChar](repeating: 0, count: 16)
        event.keyboardGetUnicodeString(maxStringLength: buffer.count, actualStringLength: &length, unicodeString: &buffer)
        return String(utf16CodeUnits: buffer, count: Int(length))
    }
}
