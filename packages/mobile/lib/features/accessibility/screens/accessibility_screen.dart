import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

// ---------------------------------------------------------------------------
// Riverpod state providers for accessibility preferences
// ---------------------------------------------------------------------------

final wheelchairUserProvider = StateProvider<bool>((ref) => false);
final visualImpairmentProvider = StateProvider<bool>((ref) => false);
final hearingImpairmentProvider = StateProvider<bool>((ref) => false);
final seniorModeProvider = StateProvider<bool>((ref) => false);

final wheelchairRoutingProvider = StateProvider<bool>((ref) => false);

final highContrastProvider = StateProvider<bool>((ref) => false);
final textSizeProvider = StateProvider<double>((ref) => 1.0);
final screenReaderProvider = StateProvider<bool>((ref) => false);
final audioNavigationProvider = StateProvider<bool>((ref) => false);

final visualNotificationsProvider = StateProvider<bool>((ref) => false);
final vibrationPatternsProvider = StateProvider<bool>((ref) => false);
final captionDisplayProvider = StateProvider<bool>((ref) => false);

final simplifiedUiProvider = StateProvider<bool>((ref) => false);
final largerButtonsProvider = StateProvider<bool>((ref) => false);
final medicationRemindersProvider = StateProvider<bool>((ref) => false);
final familyShareProvider = StateProvider<bool>((ref) => false);

// ---------------------------------------------------------------------------
// Accessibility Screen
// ---------------------------------------------------------------------------

class AccessibilityScreen extends ConsumerStatefulWidget {
  const AccessibilityScreen({super.key});

  @override
  ConsumerState<AccessibilityScreen> createState() =>
      _AccessibilityScreenState();
}

class _AccessibilityScreenState extends ConsumerState<AccessibilityScreen> {
  final TextEditingController _medicalConditionController =
      TextEditingController();
  final Map<String, bool> _expandedSections = {
    'profile': true,
    'routing': false,
    'visual': false,
    'hearing': false,
    'senior': false,
    'poi': false,
  };

  @override
  void dispose() {
    _medicalConditionController.dispose();
    super.dispose();
  }

  void _toggleSection(String key) {
    setState(() {
      _expandedSections[key] = !(_expandedSections[key] ?? false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Accessible Travel'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        backgroundColor: AppColors.info.withValues(alpha: 0.05),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header banner
            _AccessibilityBanner(),
            const SizedBox(height: 20),

            // 1 - Accessibility Profile
            _ExpandableSection(
              title: 'Accessibility Profile',
              subtitle: 'Set your accessibility needs',
              icon: Icons.accessibility_new,
              iconColor: AppColors.info,
              isExpanded: _expandedSections['profile'] ?? false,
              onToggle: () => _toggleSection('profile'),
              child: _AccessibilityProfileSection(),
            ),
            const SizedBox(height: 12),

            // 2 - Wheelchair-Accessible Routing
            _ExpandableSection(
              title: 'Wheelchair-Accessible Routing',
              subtitle: 'Find barrier-free routes',
              icon: Icons.accessible,
              iconColor: AppColors.success,
              isExpanded: _expandedSections['routing'] ?? false,
              onToggle: () => _toggleSection('routing'),
              child: _WheelchairRoutingSection(),
            ),
            const SizedBox(height: 12),

            // 3 - Visual Accessibility
            _ExpandableSection(
              title: 'Visual Accessibility',
              subtitle: 'Display and audio adjustments',
              icon: Icons.visibility,
              iconColor: AppColors.accent,
              isExpanded: _expandedSections['visual'] ?? false,
              onToggle: () => _toggleSection('visual'),
              child: _VisualAccessibilitySection(),
            ),
            const SizedBox(height: 12),

            // 4 - Hearing Accessibility
            _ExpandableSection(
              title: 'Hearing Accessibility',
              subtitle: 'Alternative alert methods',
              icon: Icons.hearing,
              iconColor: AppColors.badgeCulture,
              isExpanded: _expandedSections['hearing'] ?? false,
              onToggle: () => _toggleSection('hearing'),
              child: _HearingAccessibilitySection(),
            ),
            const SizedBox(height: 12),

            // 5 - Senior Traveler Mode
            _ExpandableSection(
              title: 'Senior Traveler Mode',
              subtitle: 'Simplified experience & safety',
              icon: Icons.elderly,
              iconColor: AppColors.warning,
              isExpanded: _expandedSections['senior'] ?? false,
              onToggle: () => _toggleSection('senior'),
              child: _SeniorTravelerSection(
                medicalController: _medicalConditionController,
              ),
            ),
            const SizedBox(height: 12),

            // 6 - Accessible POI Finder
            _ExpandableSection(
              title: 'Accessible POI Finder',
              subtitle: 'Discover accessible places nearby',
              icon: Icons.place,
              iconColor: AppColors.badgeExplorer,
              isExpanded: _expandedSections['poi'] ?? false,
              onToggle: () => _toggleSection('poi'),
              child: _AccessiblePoiSection(),
            ),
            const SizedBox(height: 24),

            // Info footer
            _AccessibilityInfoFooter(),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Banner
// ---------------------------------------------------------------------------

class _AccessibilityBanner extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.info.withValues(alpha: 0.12),
            AppColors.success.withValues(alpha: 0.08),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.info.withValues(alpha: 0.25)),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.info.withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.accessibility_new,
              color: AppColors.info,
              size: 28,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Accessible Travel Mode',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Customize your travel experience for comfort, safety, and independence.',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 13,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// 1 - Accessibility Profile Section
// ---------------------------------------------------------------------------

class _AccessibilityProfileSection extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final wheelchair = ref.watch(wheelchairUserProvider);
    final visual = ref.watch(visualImpairmentProvider);
    final hearing = ref.watch(hearingImpairmentProvider);
    final senior = ref.watch(seniorModeProvider);

    return Column(
      children: [
        _ProfileToggle(
          icon: Icons.accessible,
          label: 'Wheelchair User',
          description: 'Prioritize step-free routes and accessible venues',
          value: wheelchair,
          onChanged: (v) =>
              ref.read(wheelchairUserProvider.notifier).state = v,
          activeColor: AppColors.success,
        ),
        _ProfileToggle(
          icon: Icons.visibility,
          label: 'Visual Impairment',
          description: 'Enable screen reader support and audio cues',
          value: visual,
          onChanged: (v) =>
              ref.read(visualImpairmentProvider.notifier).state = v,
          activeColor: AppColors.accent,
        ),
        _ProfileToggle(
          icon: Icons.hearing_disabled,
          label: 'Hearing Impairment',
          description: 'Switch to visual and vibration alerts',
          value: hearing,
          onChanged: (v) =>
              ref.read(hearingImpairmentProvider.notifier).state = v,
          activeColor: AppColors.badgeCulture,
        ),
        _ProfileToggle(
          icon: Icons.elderly,
          label: 'Senior Mode',
          description: 'Larger text, simplified navigation, safety features',
          value: senior,
          onChanged: (v) => ref.read(seniorModeProvider.notifier).state = v,
          activeColor: AppColors.warning,
        ),
      ],
    );
  }
}

class _ProfileToggle extends StatelessWidget {
  final IconData icon;
  final String label;
  final String description;
  final bool value;
  final ValueChanged<bool> onChanged;
  final Color activeColor;

  const _ProfileToggle({
    required this.icon,
    required this.label,
    required this.description,
    required this.value,
    required this.onChanged,
    required this.activeColor,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      elevation: value ? 2 : 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: value
              ? activeColor.withValues(alpha: 0.5)
              : AppColors.border,
        ),
      ),
      child: SwitchListTile(
        secondary: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: (value ? activeColor : AppColors.textTertiary)
                .withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            icon,
            color: value ? activeColor : AppColors.textTertiary,
            size: 22,
          ),
        ),
        title: Text(
          label,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            color: value ? activeColor : AppColors.textPrimary,
          ),
        ),
        subtitle: Text(
          description,
          style: const TextStyle(fontSize: 12),
        ),
        value: value,
        onChanged: onChanged,
        activeColor: activeColor,
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// 2 - Wheelchair-Accessible Routing Section
// ---------------------------------------------------------------------------

class _WheelchairRoutingSection extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final enabled = ref.watch(wheelchairRoutingProvider);

    return Column(
      children: [
        SwitchListTile(
          secondary: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.success.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.route, color: AppColors.success, size: 22),
          ),
          title: const Text(
            'Enable Accessible Routing',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: const Text(
            'Avoid stairs, steep inclines, and unpaved paths',
            style: TextStyle(fontSize: 12),
          ),
          value: enabled,
          onChanged: (v) =>
              ref.read(wheelchairRoutingProvider.notifier).state = v,
          activeColor: AppColors.success,
        ),
        const SizedBox(height: 8),
        _InfoCard(
          items: const [
            _InfoItem(
              icon: Icons.elevator,
              text: 'Elevator and ramp detection',
            ),
            _InfoItem(
              icon: Icons.warning_amber,
              text: 'Surface quality warnings',
            ),
            _InfoItem(
              icon: Icons.width_normal,
              text: 'Minimum path-width filter (90 cm+)',
            ),
            _InfoItem(
              icon: Icons.wc,
              text: 'Accessible restroom markers on route',
            ),
          ],
        ),
      ],
    );
  }
}

// ---------------------------------------------------------------------------
// 3 - Visual Accessibility Section
// ---------------------------------------------------------------------------

class _VisualAccessibilitySection extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final highContrast = ref.watch(highContrastProvider);
    final textSize = ref.watch(textSizeProvider);
    final screenReader = ref.watch(screenReaderProvider);
    final audioNav = ref.watch(audioNavigationProvider);

    return Column(
      children: [
        SwitchListTile(
          secondary:
              const Icon(Icons.contrast, color: AppColors.accent, size: 24),
          title: const Text(
            'High Contrast Mode',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: const Text(
            'Increased color contrast for better visibility',
            style: TextStyle(fontSize: 12),
          ),
          value: highContrast,
          onChanged: (v) =>
              ref.read(highContrastProvider.notifier).state = v,
          activeColor: AppColors.accent,
        ),
        const Divider(height: 1),

        // Text size slider
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.text_fields,
                      color: AppColors.accent, size: 24),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Text Size',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 16,
                          ),
                        ),
                        Text(
                          _textSizeLabel(textSize),
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Text('A',
                      style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  Expanded(
                    child: Slider(
                      value: textSize,
                      min: 0.8,
                      max: 1.6,
                      divisions: 4,
                      label: _textSizeLabel(textSize),
                      activeColor: AppColors.accent,
                      onChanged: (v) =>
                          ref.read(textSizeProvider.notifier).state = v,
                    ),
                  ),
                  const Text('A',
                      style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textSecondary)),
                ],
              ),
            ],
          ),
        ),
        const Divider(height: 1),

        SwitchListTile(
          secondary: const Icon(Icons.record_voice_over,
              color: AppColors.accent, size: 24),
          title: const Text(
            'Screen Reader Optimized',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: const Text(
            'Enhanced labels and focus order for TalkBack / VoiceOver',
            style: TextStyle(fontSize: 12),
          ),
          value: screenReader,
          onChanged: (v) =>
              ref.read(screenReaderProvider.notifier).state = v,
          activeColor: AppColors.accent,
        ),
        const Divider(height: 1),

        SwitchListTile(
          secondary: const Icon(Icons.spatial_audio_off,
              color: AppColors.accent, size: 24),
          title: const Text(
            'Audio Navigation',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: const Text(
            'Spoken turn-by-turn directions and POI announcements',
            style: TextStyle(fontSize: 12),
          ),
          value: audioNav,
          onChanged: (v) =>
              ref.read(audioNavigationProvider.notifier).state = v,
          activeColor: AppColors.accent,
        ),
      ],
    );
  }

  static String _textSizeLabel(double value) {
    if (value <= 0.8) return 'Small';
    if (value <= 1.0) return 'Default';
    if (value <= 1.2) return 'Large';
    if (value <= 1.4) return 'Extra Large';
    return 'Maximum';
  }
}

// ---------------------------------------------------------------------------
// 4 - Hearing Accessibility Section
// ---------------------------------------------------------------------------

class _HearingAccessibilitySection extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final visualNotif = ref.watch(visualNotificationsProvider);
    final vibration = ref.watch(vibrationPatternsProvider);
    final captions = ref.watch(captionDisplayProvider);

    return Column(
      children: [
        SwitchListTile(
          secondary: const Icon(Icons.flash_on,
              color: AppColors.badgeCulture, size: 24),
          title: const Text(
            'Visual Notifications',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: const Text(
            'Flash screen or show on-screen banners instead of sounds',
            style: TextStyle(fontSize: 12),
          ),
          value: visualNotif,
          onChanged: (v) =>
              ref.read(visualNotificationsProvider.notifier).state = v,
          activeColor: AppColors.badgeCulture,
        ),
        const Divider(height: 1),

        SwitchListTile(
          secondary: const Icon(Icons.vibration,
              color: AppColors.badgeCulture, size: 24),
          title: const Text(
            'Vibration Patterns',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: const Text(
            'Distinct vibration patterns for different alert types',
            style: TextStyle(fontSize: 12),
          ),
          value: vibration,
          onChanged: (v) =>
              ref.read(vibrationPatternsProvider.notifier).state = v,
          activeColor: AppColors.badgeCulture,
        ),
        const Divider(height: 1),

        SwitchListTile(
          secondary: const Icon(Icons.closed_caption,
              color: AppColors.badgeCulture, size: 24),
          title: const Text(
            'Caption Display',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: const Text(
            'Show real-time captions for audio guides and chat messages',
            style: TextStyle(fontSize: 12),
          ),
          value: captions,
          onChanged: (v) =>
              ref.read(captionDisplayProvider.notifier).state = v,
          activeColor: AppColors.badgeCulture,
        ),
      ],
    );
  }
}

// ---------------------------------------------------------------------------
// 5 - Senior Traveler Mode Section
// ---------------------------------------------------------------------------

class _SeniorTravelerSection extends ConsumerWidget {
  final TextEditingController medicalController;

  const _SeniorTravelerSection({required this.medicalController});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final simplifiedUi = ref.watch(simplifiedUiProvider);
    final largerButtons = ref.watch(largerButtonsProvider);
    final medicationReminders = ref.watch(medicationRemindersProvider);
    final familyShare = ref.watch(familyShareProvider);

    return Column(
      children: [
        SwitchListTile(
          secondary: const Icon(Icons.dashboard_customize,
              color: AppColors.warning, size: 24),
          title: const Text(
            'Simplified UI',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: const Text(
            'Reduce visual clutter, show only essential features',
            style: TextStyle(fontSize: 12),
          ),
          value: simplifiedUi,
          onChanged: (v) =>
              ref.read(simplifiedUiProvider.notifier).state = v,
          activeColor: AppColors.warning,
        ),
        const Divider(height: 1),

        SwitchListTile(
          secondary: const Icon(Icons.touch_app,
              color: AppColors.warning, size: 24),
          title: const Text(
            'Larger Buttons & Targets',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: const Text(
            'Increase tap target size for easier interaction',
            style: TextStyle(fontSize: 12),
          ),
          value: largerButtons,
          onChanged: (v) =>
              ref.read(largerButtonsProvider.notifier).state = v,
          activeColor: AppColors.warning,
        ),
        const Divider(height: 1),

        // Medical Condition Input
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.medical_information,
                      color: AppColors.warning, size: 24),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'Medical Conditions',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 16,
                          ),
                        ),
                        Text(
                          'Stored securely, shared only in emergencies',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              TextField(
                controller: medicalController,
                maxLines: 3,
                decoration: InputDecoration(
                  hintText:
                      'e.g. Diabetes Type 2, Pacemaker, Penicillin allergy...',
                  hintStyle: TextStyle(
                    color: AppColors.textTertiary,
                    fontSize: 13,
                  ),
                  filled: true,
                  fillColor: AppColors.surfaceVariant,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: AppColors.border),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: AppColors.border),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide:
                        const BorderSide(color: AppColors.warning, width: 1.5),
                  ),
                  contentPadding: const EdgeInsets.all(14),
                ),
              ),
            ],
          ),
        ),
        const Divider(height: 1),

        SwitchListTile(
          secondary: const Icon(Icons.medication,
              color: AppColors.warning, size: 24),
          title: const Text(
            'Medication Reminders',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: const Text(
            'Time-zone aware alerts for medication schedules',
            style: TextStyle(fontSize: 12),
          ),
          value: medicationReminders,
          onChanged: (v) =>
              ref.read(medicationRemindersProvider.notifier).state = v,
          activeColor: AppColors.warning,
        ),
        const Divider(height: 1),

        SwitchListTile(
          secondary: const Icon(Icons.family_restroom,
              color: AppColors.warning, size: 24),
          title: const Text(
            'Family Share',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: const Text(
            'Let family members view your trip status and location',
            style: TextStyle(fontSize: 12),
          ),
          value: familyShare,
          onChanged: (v) =>
              ref.read(familyShareProvider.notifier).state = v,
          activeColor: AppColors.warning,
        ),
      ],
    );
  }
}

// ---------------------------------------------------------------------------
// 6 - Accessible POI Finder Section
// ---------------------------------------------------------------------------

class _AccessiblePoiSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Quick-filter chips
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Filter by accessibility features',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: const [
                  _PoiFilterChip(
                    icon: Icons.accessible,
                    label: 'Wheelchair Ramp',
                  ),
                  _PoiFilterChip(
                    icon: Icons.elevator,
                    label: 'Elevator',
                  ),
                  _PoiFilterChip(
                    icon: Icons.wc,
                    label: 'Accessible WC',
                  ),
                  _PoiFilterChip(
                    icon: Icons.hearing,
                    label: 'Hearing Loop',
                  ),
                  _PoiFilterChip(
                    icon: Icons.braille,
                    label: 'Braille Signs',
                  ),
                  _PoiFilterChip(
                    icon: Icons.local_parking,
                    label: 'Disabled Parking',
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),

        // Sample accessible POIs
        _AccessiblePoiCard(
          name: 'Central Museum',
          tags: const ['Wheelchair Ramp', 'Elevator', 'Audio Guide'],
          distance: '1.2 km',
          rating: '4.6',
          icon: Icons.museum,
        ),
        _AccessiblePoiCard(
          name: 'Riverside Park',
          tags: const ['Paved Paths', 'Accessible WC', 'Benches'],
          distance: '0.8 km',
          rating: '4.3',
          icon: Icons.park,
        ),
        _AccessiblePoiCard(
          name: 'City Library',
          tags: const ['Elevator', 'Braille Signs', 'Hearing Loop'],
          distance: '2.1 km',
          rating: '4.8',
          icon: Icons.local_library,
        ),

        const SizedBox(height: 8),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.search, size: 18),
            label: const Text('Search More Accessible Places'),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.badgeExplorer,
              side: BorderSide(
                  color: AppColors.badgeExplorer.withValues(alpha: 0.5)),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
        ),
      ],
    );
  }
}

class _PoiFilterChip extends StatefulWidget {
  final IconData icon;
  final String label;

  const _PoiFilterChip({required this.icon, required this.label});

  @override
  State<_PoiFilterChip> createState() => _PoiFilterChipState();
}

class _PoiFilterChipState extends State<_PoiFilterChip> {
  bool _selected = false;

  @override
  Widget build(BuildContext context) {
    return FilterChip(
      avatar: Icon(widget.icon, size: 16),
      label: Text(widget.label, style: const TextStyle(fontSize: 12)),
      selected: _selected,
      onSelected: (v) => setState(() => _selected = v),
      selectedColor: AppColors.badgeExplorer.withValues(alpha: 0.15),
      checkmarkColor: AppColors.badgeExplorer,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
    );
  }
}

class _AccessiblePoiCard extends StatelessWidget {
  final String name;
  final List<String> tags;
  final String distance;
  final String rating;
  final IconData icon;

  const _AccessiblePoiCard({
    required this.name,
    required this.tags,
    required this.distance,
    required this.rating,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: AppColors.badgeExplorer.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child:
                  Icon(icon, color: AppColors.badgeExplorer, size: 24),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name,
                      style: const TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 4),
                  Wrap(
                    spacing: 4,
                    runSpacing: 4,
                    children: tags
                        .map((t) => Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color:
                                    AppColors.success.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                t,
                                style: const TextStyle(
                                  fontSize: 10,
                                  color: AppColors.success,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ))
                        .toList(),
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.star, color: AppColors.warning, size: 14),
                    const SizedBox(width: 2),
                    Text(rating,
                        style: const TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  distance,
                  style: const TextStyle(
                      fontSize: 11, color: AppColors.textSecondary),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Expandable Section Card
// ---------------------------------------------------------------------------

class _ExpandableSection extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color iconColor;
  final bool isExpanded;
  final VoidCallback onToggle;
  final Widget child;

  const _ExpandableSection({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.iconColor,
    required this.isExpanded,
    required this.onToggle,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      elevation: isExpanded ? 2 : 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: BorderSide(
          color: isExpanded
              ? iconColor.withValues(alpha: 0.35)
              : AppColors.border,
        ),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          InkWell(
            onTap: onToggle,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: iconColor.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(icon, color: iconColor, size: 22),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            fontSize: 15,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          subtitle,
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  AnimatedRotation(
                    turns: isExpanded ? 0.5 : 0,
                    duration: const Duration(milliseconds: 200),
                    child: const Icon(Icons.expand_more, size: 24),
                  ),
                ],
              ),
            ),
          ),
          AnimatedCrossFade(
            firstChild: const SizedBox.shrink(),
            secondChild: Column(
              children: [
                const Divider(height: 1),
                child,
                const SizedBox(height: 8),
              ],
            ),
            crossFadeState: isExpanded
                ? CrossFadeState.showSecond
                : CrossFadeState.showFirst,
            duration: const Duration(milliseconds: 250),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Info Card (used in routing section)
// ---------------------------------------------------------------------------

class _InfoCard extends StatelessWidget {
  final List<_InfoItem> items;

  const _InfoCard({required this.items});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.success.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.success.withValues(alpha: 0.2)),
      ),
      child: Column(
        children: items
            .map((item) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    children: [
                      Icon(item.icon,
                          size: 18, color: AppColors.success),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          item.text,
                          style: const TextStyle(
                            fontSize: 13,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ))
            .toList(),
      ),
    );
  }
}

class _InfoItem {
  final IconData icon;
  final String text;

  const _InfoItem({required this.icon, required this.text});
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

class _AccessibilityInfoFooter extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.info.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.info.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.info_outline, color: AppColors.info, size: 20),
              SizedBox(width: 8),
              Text(
                'About Accessible Travel',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            'Partner is committed to making travel inclusive for everyone. '
            'Accessibility data is crowd-sourced and verified by our community. '
            'Help us improve by reporting accessibility issues at any location.',
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 13,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.feedback_outlined, size: 18),
              label: const Text('Report an Accessibility Issue'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.info,
                side: BorderSide(color: AppColors.info.withValues(alpha: 0.4)),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
