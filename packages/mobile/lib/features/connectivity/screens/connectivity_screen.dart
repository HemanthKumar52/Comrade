import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

final connectivityTabProvider = StateProvider<int>((ref) => 0);

final selectedCountryProvider = StateProvider<String>((ref) => 'Thailand');

final offlineDownloadsProvider =
    StateNotifierProvider<OfflineDownloadsNotifier, Map<String, double>>(
  (ref) => OfflineDownloadsNotifier(),
);

class OfflineDownloadsNotifier extends StateNotifier<Map<String, double>> {
  OfflineDownloadsNotifier() : super({});

  void startDownload(String key) {
    state = {...state, key: 0.0};
    _simulateProgress(key);
  }

  void _simulateProgress(String key) async {
    for (var i = 1; i <= 10; i++) {
      await Future.delayed(const Duration(milliseconds: 300));
      if (!mounted) return;
      state = {...state, key: i / 10};
    }
  }
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

class ConnectivityScreen extends ConsumerWidget {
  const ConnectivityScreen({super.key});

  static const _tabs = ['Wi-Fi', 'SIM/eSIM', 'Offline', 'VPN'];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentTab = ref.watch(connectivityTabProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Connectivity Hub'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        backgroundColor: AppColors.info.withValues(alpha: 0.05),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: _TabBar(
            tabs: _tabs,
            selectedIndex: currentTab,
            onTap: (i) =>
                ref.read(connectivityTabProvider.notifier).state = i,
          ),
        ),
      ),
      body: IndexedStack(
        index: currentTab,
        children: const [
          _WiFiTab(),
          _SimEsimTab(),
          _OfflineTab(),
          _VpnTab(),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Custom Tab Bar
// ---------------------------------------------------------------------------

class _TabBar extends StatelessWidget {
  final List<String> tabs;
  final int selectedIndex;
  final ValueChanged<int> onTap;

  const _TabBar({
    required this.tabs,
    required this.selectedIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 42,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        itemCount: tabs.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final isSelected = selectedIndex == index;
          return ChoiceChip(
            selected: isSelected,
            onSelected: (_) => onTap(index),
            label: Text(tabs[index]),
            selectedColor: AppColors.primary.withValues(alpha: 0.14),
            backgroundColor: AppColors.surfaceVariant,
            labelStyle: TextStyle(
              color: isSelected ? AppColors.primary : AppColors.textSecondary,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
              fontSize: 13,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
              side: BorderSide(
                color: isSelected
                    ? AppColors.primary.withValues(alpha: 0.4)
                    : AppColors.border,
              ),
            ),
          );
        },
      ),
    );
  }
}

// ===========================================================================
// TAB 1 : Wi-Fi Hotspots
// ===========================================================================

class _WiFiTab extends StatelessWidget {
  const _WiFiTab();

  static const _hotspots = [
    {
      'name': 'Starbucks Sukhumvit 11',
      'speed': 4,
      'reliability': 'Excellent',
      'password': 'Free - No password',
      'indoor': true,
      'distance': '120 m',
    },
    {
      'name': 'True Coffee Siam Paragon',
      'speed': 5,
      'reliability': 'Excellent',
      'password': 'Ask staff',
      'indoor': true,
      'distance': '350 m',
    },
    {
      'name': 'Lumpini Park Public WiFi',
      'speed': 2,
      'reliability': 'Fair',
      'password': 'Free - Registration required',
      'indoor': false,
      'distance': '0.8 km',
    },
    {
      'name': 'AIS Super WiFi - CentralWorld',
      'speed': 4,
      'reliability': 'Good',
      'password': 'AIS customers free',
      'indoor': true,
      'distance': '1.1 km',
    },
    {
      'name': 'CAT Telecom Public Spot',
      'speed': 3,
      'reliability': 'Good',
      'password': 'Free - 1 hr limit',
      'indoor': false,
      'distance': '1.5 km',
    },
    {
      'name': 'The Commons Thonglor',
      'speed': 5,
      'reliability': 'Excellent',
      'password': 'commons2024',
      'indoor': true,
      'distance': '2.3 km',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppColors.info, AppColors.primary],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Row(
              children: [
                Icon(Icons.wifi, color: AppColors.white, size: 28),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Nearby Wi-Fi Hotspots',
                        style: TextStyle(
                          color: AppColors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        '6 hotspots found in your area',
                        style: TextStyle(
                          color: AppColors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // International Calling quick info
          _SectionHeader(title: 'Hotspot List'),
          const SizedBox(height: 8),

          ..._hotspots.map((h) => _HotspotCard(
                name: h['name'] as String,
                speed: h['speed'] as int,
                reliability: h['reliability'] as String,
                password: h['password'] as String,
                indoor: h['indoor'] as bool,
                distance: h['distance'] as String,
              )),

          const SizedBox(height: 20),

          // International Calling Section
          _SectionHeader(title: 'International Calling'),
          const SizedBox(height: 8),
          _DialingCodeCard(
            country: 'Thailand',
            code: '+66',
            icon: Icons.phone,
          ),
          _DialingCodeCard(
            country: 'India',
            code: '+91',
            icon: Icons.phone,
          ),
          _DialingCodeCard(
            country: 'United States',
            code: '+1',
            icon: Icons.phone,
          ),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.success.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: AppColors.success.withValues(alpha: 0.3),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.call, color: AppColors.success, size: 18),
                    SizedBox(width: 8),
                    Text(
                      'Free Calling Apps',
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '- WhatsApp - Free calls & video over Wi-Fi\n'
                  '- Skype - Cheap international calls\n'
                  '- Google Meet - Free group video calls\n'
                  '- Telegram - Free voice & video calls',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 13,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _HotspotCard extends StatelessWidget {
  final String name;
  final int speed;
  final String reliability;
  final String password;
  final bool indoor;
  final String distance;

  const _HotspotCard({
    required this.name,
    required this.speed,
    required this.reliability,
    required this.password,
    required this.indoor,
    required this.distance,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: AppColors.info.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.wifi, color: AppColors.info, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        distance,
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: indoor
                        ? AppColors.primary.withValues(alpha: 0.1)
                        : AppColors.badgeAdventure.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    indoor ? 'Indoor' : 'Outdoor',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color:
                          indoor ? AppColors.primary : AppColors.badgeAdventure,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                // Speed stars
                const Text(
                  'Speed: ',
                  style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
                ...List.generate(
                  5,
                  (i) => Icon(
                    i < speed ? Icons.star_rounded : Icons.star_border_rounded,
                    size: 16,
                    color: i < speed ? AppColors.warning : AppColors.disabled,
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: _reliabilityColor(reliability).withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    reliability,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: _reliabilityColor(reliability),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Row(
              children: [
                Icon(Icons.lock_outline, size: 14, color: AppColors.textTertiary),
                const SizedBox(width: 4),
                Text(
                  password,
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _reliabilityColor(String r) {
    switch (r) {
      case 'Excellent':
        return AppColors.success;
      case 'Good':
        return AppColors.info;
      default:
        return AppColors.warning;
    }
  }
}

class _DialingCodeCard extends StatelessWidget {
  final String country;
  final String code;
  final IconData icon;

  const _DialingCodeCard({
    required this.country,
    required this.code,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 6),
      child: ListTile(
        leading: Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(
            color: AppColors.accent.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: AppColors.accent, size: 20),
        ),
        title: Text(country,
            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
        trailing: Text(
          code,
          style: const TextStyle(
            fontWeight: FontWeight.w700,
            fontSize: 15,
            color: AppColors.primary,
          ),
        ),
      ),
    );
  }
}

// ===========================================================================
// TAB 2 : SIM / eSIM
// ===========================================================================

class _SimEsimTab extends StatelessWidget {
  const _SimEsimTab();

  static const _simOptions = [
    {
      'carrier': 'TrueMove H Tourist SIM',
      'data': '30 GB',
      'validity': '15 days',
      'price': '\$12',
      'calls': '100 min local',
      'highlight': 'Best value',
    },
    {
      'carrier': 'AIS Traveller SIM',
      'data': '15 GB',
      'validity': '8 days',
      'price': '\$8',
      'calls': '50 min local',
      'highlight': 'Most popular',
    },
    {
      'carrier': 'DTAC Happy Tourist',
      'data': '50 GB',
      'validity': '30 days',
      'price': '\$20',
      'calls': 'Unlimited local',
      'highlight': 'Heavy usage',
    },
  ];

  static const _esimSteps = [
    'Check your phone supports eSIM (iPhone XS+, Pixel 3+, Samsung S20+)',
    'Purchase an eSIM plan from Airalo, Holafly, or Nomad',
    'Scan the QR code or enter activation details manually',
    'Set the eSIM as your data line, keep physical SIM for calls',
    'Turn on data roaming for the eSIM line if prompted',
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppColors.accent, AppColors.accentDark],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Row(
              children: [
                Icon(Icons.sim_card, color: AppColors.white, size: 28),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Local SIM & eSIM Plans',
                        style: TextStyle(
                          color: AppColors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Stay connected with affordable local plans',
                        style: TextStyle(
                          color: AppColors.white,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          _SectionHeader(title: 'Top SIM Card Options'),
          const SizedBox(height: 10),

          ..._simOptions.map((s) => _SimCard(
                carrier: s['carrier'] as String,
                data: s['data'] as String,
                validity: s['validity'] as String,
                price: s['price'] as String,
                calls: s['calls'] as String,
                highlight: s['highlight'] as String,
              )),

          const SizedBox(height: 24),

          // eSIM Activation Guide
          _SectionHeader(title: 'eSIM Activation Guide'),
          const SizedBox(height: 10),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.badgeExplorer.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: AppColors.badgeExplorer.withValues(alpha: 0.25),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.qr_code_2,
                        color: AppColors.badgeExplorer, size: 22),
                    SizedBox(width: 8),
                    Text(
                      'How to set up eSIM',
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                        color: AppColors.badgeExplorer,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                ...List.generate(
                  _esimSteps.length,
                  (i) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 22,
                          height: 22,
                          decoration: BoxDecoration(
                            color: AppColors.badgeExplorer.withValues(alpha: 0.15),
                            shape: BoxShape.circle,
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            '${i + 1}',
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: AppColors.badgeExplorer,
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            _esimSteps[i],
                            style: TextStyle(
                              fontSize: 13,
                              height: 1.4,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Roaming Calculator
          _SectionHeader(title: 'Roaming Cost Calculator'),
          const SizedBox(height: 10),
          const _RoamingCalculator(),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _SimCard extends StatelessWidget {
  final String carrier;
  final String data;
  final String validity;
  final String price;
  final String calls;
  final String highlight;

  const _SimCard({
    required this.carrier,
    required this.data,
    required this.validity,
    required this.price,
    required this.calls,
    required this.highlight,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: AppColors.accent.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.sim_card,
                      color: AppColors.accent, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        carrier,
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.success.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          highlight,
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: AppColors.success,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  price,
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 22,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _simInfoChip(Icons.data_usage, data),
                const SizedBox(width: 10),
                _simInfoChip(Icons.schedule, validity),
                const SizedBox(width: 10),
                _simInfoChip(Icons.phone_in_talk, calls),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _simInfoChip(IconData icon, String text) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6),
        decoration: BoxDecoration(
          color: AppColors.surfaceVariant,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 14, color: AppColors.textTertiary),
            const SizedBox(width: 4),
            Flexible(
              child: Text(
                text,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RoamingCalculator extends StatefulWidget {
  const _RoamingCalculator();

  @override
  State<_RoamingCalculator> createState() => _RoamingCalculatorState();
}

class _RoamingCalculatorState extends State<_RoamingCalculator> {
  double _dataGb = 2;
  double _callMinutes = 30;
  int _days = 7;

  double get _estimatedCost => (_dataGb * 12) + (_callMinutes * 0.5) + (_days * 2);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.warning.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.warning.withValues(alpha: 0.25)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.calculate, color: AppColors.warning, size: 22),
              SizedBox(width: 8),
              Text(
                'Estimate Your Roaming Cost',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Data: ${_dataGb.toStringAsFixed(1)} GB',
            style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),
          Slider(
            value: _dataGb,
            min: 0.5,
            max: 20,
            divisions: 39,
            activeColor: AppColors.primary,
            onChanged: (v) => setState(() => _dataGb = v),
          ),
          Text(
            'Calls: ${_callMinutes.toInt()} min',
            style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),
          Slider(
            value: _callMinutes,
            min: 0,
            max: 300,
            divisions: 30,
            activeColor: AppColors.primary,
            onChanged: (v) => setState(() => _callMinutes = v),
          ),
          Text(
            'Duration: $_days days',
            style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),
          Slider(
            value: _days.toDouble(),
            min: 1,
            max: 30,
            divisions: 29,
            activeColor: AppColors.primary,
            onChanged: (v) => setState(() => _days = v.toInt()),
          ),
          const SizedBox(height: 8),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Estimated roaming cost:',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                ),
                Text(
                  '\$${_estimatedCost.toStringAsFixed(0)}',
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 22,
                    color: AppColors.error,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Tip: A local SIM is usually 70-90% cheaper than roaming!',
            style: TextStyle(
              fontSize: 12,
              fontStyle: FontStyle.italic,
              color: AppColors.success,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

// ===========================================================================
// TAB 3 : Offline Content Hub
// ===========================================================================

class _OfflineTab extends ConsumerWidget {
  const _OfflineTab();

  static const _maps = [
    {'name': 'Bangkok City Map', 'size': '45 MB', 'key': 'map_bangkok'},
    {'name': 'Chiang Mai Region', 'size': '32 MB', 'key': 'map_chiangmai'},
    {'name': 'Phuket & Islands', 'size': '28 MB', 'key': 'map_phuket'},
    {'name': 'Full Thailand', 'size': '180 MB', 'key': 'map_thailand'},
  ];

  static const _languagePacks = [
    {'name': 'Thai Language Pack', 'size': '18 MB', 'key': 'lang_thai'},
    {'name': 'Japanese Language Pack', 'size': '22 MB', 'key': 'lang_japanese'},
    {'name': 'French Language Pack', 'size': '15 MB', 'key': 'lang_french'},
    {'name': 'Spanish Language Pack', 'size': '14 MB', 'key': 'lang_spanish'},
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final downloads = ref.watch(offlineDownloadsProvider);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Storage indicator
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surfaceVariant,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.storage, color: AppColors.primary, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'Storage Used',
                          style: TextStyle(
                              fontWeight: FontWeight.w700, fontSize: 14),
                        ),
                      ],
                    ),
                    Text(
                      '1.2 GB / 8 GB',
                      style: TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: LinearProgressIndicator(
                    value: 0.15,
                    minHeight: 8,
                    backgroundColor: AppColors.border,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  '6.8 GB available',
                  style: TextStyle(fontSize: 12, color: AppColors.textTertiary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Offline Maps
          _SectionHeader(title: 'Offline Maps'),
          const SizedBox(height: 10),
          ..._maps.map((m) => _DownloadableItem(
                icon: Icons.map,
                iconColor: AppColors.primary,
                name: m['name'] as String,
                size: m['size'] as String,
                downloadKey: m['key'] as String,
                progress: downloads[m['key']],
              )),

          const SizedBox(height: 24),

          // Language Packs
          _SectionHeader(title: 'Language Packs'),
          const SizedBox(height: 10),
          ..._languagePacks.map((l) => _DownloadableItem(
                icon: Icons.translate,
                iconColor: AppColors.badgeCulture,
                name: l['name'] as String,
                size: l['size'] as String,
                downloadKey: l['key'] as String,
                progress: downloads[l['key']],
              )),

          const SizedBox(height: 20),

          // Tips
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.info.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.info.withValues(alpha: 0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.tips_and_updates, color: AppColors.info, size: 18),
                    SizedBox(width: 8),
                    Text(
                      'Offline Tips',
                      style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '- Download maps and language packs on Wi-Fi\n'
                  '- Offline maps include POIs and basic routing\n'
                  '- Language packs enable camera translation offline\n'
                  '- Clear old downloads to free up space',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 13,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _DownloadableItem extends ConsumerWidget {
  final IconData icon;
  final Color iconColor;
  final String name;
  final String size;
  final String downloadKey;
  final double? progress;

  const _DownloadableItem({
    required this.icon,
    required this.iconColor,
    required this.name,
    required this.size,
    required this.downloadKey,
    this.progress,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDownloading = progress != null && progress! < 1.0;
    final isComplete = progress != null && progress! >= 1.0;

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12),
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
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: const TextStyle(
                        fontWeight: FontWeight.w600, fontSize: 14),
                  ),
                  const SizedBox(height: 2),
                  if (isDownloading) ...[
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: progress,
                        minHeight: 4,
                        backgroundColor: AppColors.border,
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${(progress! * 100).toInt()}%',
                      style: TextStyle(
                          fontSize: 11, color: AppColors.textTertiary),
                    ),
                  ] else
                    Text(
                      size,
                      style: TextStyle(
                          fontSize: 12, color: AppColors.textSecondary),
                    ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            if (isComplete)
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.success.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check,
                    color: AppColors.success, size: 20),
              )
            else if (isDownloading)
              const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            else
              IconButton(
                onPressed: () => ref
                    .read(offlineDownloadsProvider.notifier)
                    .startDownload(downloadKey),
                icon: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.download,
                      color: AppColors.primary, size: 20),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// ===========================================================================
// TAB 4 : VPN Guide
// ===========================================================================

class _VpnTab extends StatelessWidget {
  const _VpnTab();

  static const _restrictedCountries = [
    {
      'country': 'China',
      'restrictions':
          'Most Western sites blocked (Google, Facebook, WhatsApp). VPN essential.',
      'severity': 'High',
    },
    {
      'country': 'Iran',
      'restrictions':
          'Social media heavily restricted. Many VPNs blocked.',
      'severity': 'High',
    },
    {
      'country': 'Russia',
      'restrictions':
          'Some social media and news sites blocked. VPN recommended.',
      'severity': 'Medium',
    },
    {
      'country': 'UAE',
      'restrictions':
          'VoIP calls blocked (WhatsApp calls, FaceTime). VPN helps.',
      'severity': 'Medium',
    },
    {
      'country': 'Turkey',
      'restrictions':
          'Wikipedia and some social media periodically blocked.',
      'severity': 'Low',
    },
  ];

  static const _vpnRecommendations = [
    {
      'name': 'ExpressVPN',
      'price': '\$8.32/mo',
      'rating': 5,
      'note': 'Works in China, fastest speeds',
    },
    {
      'name': 'NordVPN',
      'price': '\$3.99/mo',
      'rating': 4,
      'note': 'Best value, large server network',
    },
    {
      'name': 'Surfshark',
      'price': '\$2.49/mo',
      'rating': 4,
      'note': 'Unlimited devices, budget-friendly',
    },
    {
      'name': 'ProtonVPN',
      'price': 'Free tier',
      'rating': 3,
      'note': 'Free option available, Swiss privacy',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppColors.badgeExplorer, AppColors.primaryDark],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Row(
              children: [
                Icon(Icons.shield, color: AppColors.white, size: 28),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'VPN & Internet Freedom',
                        style: TextStyle(
                          color: AppColors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Stay secure and access content anywhere',
                        style: TextStyle(
                          color: AppColors.white,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Restricted Countries
          _SectionHeader(title: 'Countries with Restrictions'),
          const SizedBox(height: 10),

          ..._restrictedCountries.map((c) => _RestrictionCard(
                country: c['country'] as String,
                restrictions: c['restrictions'] as String,
                severity: c['severity'] as String,
              )),

          const SizedBox(height: 24),

          // Recommended VPNs
          _SectionHeader(title: 'Recommended VPNs'),
          const SizedBox(height: 10),

          ..._vpnRecommendations.map((v) => _VpnCard(
                name: v['name'] as String,
                price: v['price'] as String,
                rating: v['rating'] as int,
                note: v['note'] as String,
              )),

          const SizedBox(height: 20),

          // VPN Tips
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.warning.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                  color: AppColors.warning.withValues(alpha: 0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.tips_and_updates,
                        color: AppColors.warning, size: 18),
                    SizedBox(width: 8),
                    Text(
                      'VPN Travel Tips',
                      style:
                          TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '- Install and test your VPN before traveling\n'
                  '- Download the VPN app for offline config\n'
                  '- Some countries penalize VPN use - research laws\n'
                  '- Use split tunneling for local + foreign apps\n'
                  '- Connect to nearby servers for better speed',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 13,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _RestrictionCard extends StatelessWidget {
  final String country;
  final String restrictions;
  final String severity;

  const _RestrictionCard({
    required this.country,
    required this.restrictions,
    required this.severity,
  });

  Color get _severityColor {
    switch (severity) {
      case 'High':
        return AppColors.error;
      case 'Medium':
        return AppColors.warning;
      default:
        return AppColors.info;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: _severityColor.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(Icons.public, color: _severityColor, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        country,
                        style: const TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 14),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: _severityColor.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          severity,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: _severityColor,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    restrictions,
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                      height: 1.3,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _VpnCard extends StatelessWidget {
  final String name;
  final String price;
  final int rating;
  final String note;

  const _VpnCard({
    required this.name,
    required this.price,
    required this.rating,
    required this.note,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.badgeExplorer.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.vpn_key,
                  color: AppColors.badgeExplorer, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 14),
                      ),
                      const SizedBox(width: 8),
                      ...List.generate(
                        5,
                        (i) => Icon(
                          i < rating
                              ? Icons.star_rounded
                              : Icons.star_border_rounded,
                          size: 14,
                          color: i < rating
                              ? AppColors.warning
                              : AppColors.disabled,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    note,
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            Text(
              price,
              style: const TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 13,
                color: AppColors.primary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ===========================================================================
// Shared Widgets
// ===========================================================================

class _SectionHeader extends StatelessWidget {
  final String title;

  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w700,
          ),
    );
  }
}
