import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/network/api_client.dart';

// ---------------------------------------------------------------------------
// Models
// ---------------------------------------------------------------------------

class PackingItem {
  final String id;
  final String name;
  final String category;
  bool isPacked;

  PackingItem({
    required this.id,
    required this.name,
    required this.category,
    this.isPacked = false,
  });

  PackingItem copyWith({bool? isPacked}) {
    return PackingItem(
      id: id,
      name: name,
      category: category,
      isPacked: isPacked ?? this.isPacked,
    );
  }
}

class PreTripItem {
  final String id;
  final String title;
  final String subtitle;
  final IconData icon;
  bool isCompleted;

  PreTripItem({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.icon,
    this.isCompleted = false,
  });
}

class DayItinerary {
  final int day;
  final String title;
  final List<TimeBlock> blocks;

  const DayItinerary({
    required this.day,
    required this.title,
    required this.blocks,
  });
}

class TimeBlock {
  final String time;
  final String activity;
  final IconData icon;

  const TimeBlock({
    required this.time,
    required this.activity,
    required this.icon,
  });
}

// ---------------------------------------------------------------------------
// Category metadata
// ---------------------------------------------------------------------------

class _CategoryMeta {
  final String label;
  final IconData icon;
  final Color color;

  const _CategoryMeta({
    required this.label,
    required this.icon,
    required this.color,
  });
}

const Map<String, _CategoryMeta> _categoryMeta = {
  'clothing': _CategoryMeta(
    label: 'Clothing',
    icon: Icons.checkroom,
    color: AppColors.info,
  ),
  'electronics': _CategoryMeta(
    label: 'Electronics',
    icon: Icons.devices,
    color: AppColors.badgeExplorer,
  ),
  'documents': _CategoryMeta(
    label: 'Documents',
    icon: Icons.description,
    color: AppColors.accent,
  ),
  'health': _CategoryMeta(
    label: 'Health / Medicine',
    icon: Icons.medical_services,
    color: AppColors.error,
  ),
  'money': _CategoryMeta(
    label: 'Money',
    icon: Icons.account_balance_wallet,
    color: AppColors.success,
  ),
  'toiletries': _CategoryMeta(
    label: 'Toiletries',
    icon: Icons.soap,
    color: AppColors.badgeSocial,
  ),
};

// ---------------------------------------------------------------------------
// AI list templates keyed by travel type
// ---------------------------------------------------------------------------

Map<String, List<String>> _clothingByType(String travelType, int days) {
  final base = ['Underwear x$days', 'Socks x$days', 'Sleepwear'];
  switch (travelType) {
    case 'beach':
      return {
        'clothing': [
          ...base,
          'Swimsuit',
          'Cover-up / sarong',
          'Flip flops',
          'Light shorts x${(days / 2).ceil()}',
          'T-shirts x${(days / 2).ceil()}',
          'Sunhat',
          'Light jacket',
        ],
      };
    case 'mountain':
      return {
        'clothing': [
          ...base,
          'Thermal base layer',
          'Fleece / down jacket',
          'Waterproof outer shell',
          'Hiking pants x2',
          'Trekking boots',
          'Warm hat & gloves',
          'Quick-dry T-shirts x${(days / 2).ceil()}',
        ],
      };
    case 'desert':
      return {
        'clothing': [
          ...base,
          'Loose long-sleeve shirts x${(days / 2).ceil()}',
          'Light pants x2',
          'Wide-brim hat',
          'Scarf / bandana',
          'Closed-toe breathable shoes',
          'Sandals for camp',
          'Light jacket (desert nights)',
        ],
      };
    default: // city
      return {
        'clothing': [
          ...base,
          'Casual shirts x${(days / 2).ceil()}',
          'Jeans / trousers x2',
          'Comfortable walking shoes',
          'Smart-casual outfit',
          'Light jacket / blazer',
          'Foldable umbrella',
        ],
      };
  }
}

Map<String, List<String>> _generateItems(
  String travelType,
  int days,
  String travelerType,
) {
  final clothing = _clothingByType(travelType, days);

  final electronics = [
    'Phone charger',
    'Power bank',
    'Universal adapter',
    'Earphones / headphones',
    if (travelerType == 'photographer' || travelerType == 'content-creator') ...[
      'Camera + lenses',
      'Tripod',
      'Extra SD cards',
      'Laptop / tablet',
    ] else ...[
      'Kindle / e-reader',
    ],
  ];

  final documents = [
    'Passport / ID',
    'Travel insurance printout',
    'Booking confirmations',
    'Copies of important documents',
    'Emergency contact list',
    if (travelType == 'mountain') 'Permits / passes',
  ];

  final health = [
    'Prescription medications',
    'First-aid kit',
    'Sunscreen SPF 50+',
    'Insect repellent',
    'Hand sanitizer',
    'Face masks',
    if (travelType == 'mountain') 'Altitude sickness tablets',
    if (travelType == 'beach') 'Aloe vera gel',
  ];

  final money = [
    'Local currency cash',
    'Credit / debit cards',
    'Travel wallet',
    'Backup card (separate bag)',
    'Small denominations for tips',
  ];

  final toiletries = [
    'Toothbrush & toothpaste',
    'Shampoo & conditioner',
    'Deodorant',
    'Razor / grooming kit',
    'Lip balm with SPF',
    'Wet wipes',
    'Travel towel',
    if (travelerType == 'minimalist')
      'Solid soap bar (multi-use)'
    else
      'Body wash',
  ];

  return {
    ...clothing,
    'electronics': electronics,
    'documents': documents,
    'health': health,
    'money': money,
    'toiletries': toiletries,
  };
}

// ---------------------------------------------------------------------------
// Riverpod state
// ---------------------------------------------------------------------------

class PackingListState {
  final List<PackingItem> items;
  final List<PreTripItem> preTripItems;
  final bool isGenerated;
  final String destination;
  final int tripDays;
  final String travelType;
  final String travelerType;

  const PackingListState({
    this.items = const [],
    this.preTripItems = const [],
    this.isGenerated = false,
    this.destination = '',
    this.tripDays = 3,
    this.travelType = 'city',
    this.travelerType = 'casual',
  });

  double get packedProgress {
    if (items.isEmpty) return 0;
    return items.where((i) => i.isPacked).length / items.length;
  }

  int get packedCount => items.where((i) => i.isPacked).length;

  PackingListState copyWith({
    List<PackingItem>? items,
    List<PreTripItem>? preTripItems,
    bool? isGenerated,
    String? destination,
    int? tripDays,
    String? travelType,
    String? travelerType,
  }) {
    return PackingListState(
      items: items ?? this.items,
      preTripItems: preTripItems ?? this.preTripItems,
      isGenerated: isGenerated ?? this.isGenerated,
      destination: destination ?? this.destination,
      tripDays: tripDays ?? this.tripDays,
      travelType: travelType ?? this.travelType,
      travelerType: travelerType ?? this.travelerType,
    );
  }
}

class PackingListNotifier extends StateNotifier<PackingListState> {
  PackingListNotifier() : super(_initialState());

  static PackingListState _initialState() {
    return PackingListState(
      preTripItems: [
        PreTripItem(
          id: 'flight',
          title: 'Flight booking',
          subtitle: 'Confirm departure & return flights',
          icon: Icons.flight_takeoff,
        ),
        PreTripItem(
          id: 'accommodation',
          title: 'Accommodation',
          subtitle: 'Hotel / hostel / Airbnb booked',
          icon: Icons.hotel,
        ),
        PreTripItem(
          id: 'insurance',
          title: 'Travel insurance',
          subtitle: 'Purchase & save policy documents',
          icon: Icons.health_and_safety,
        ),
        PreTripItem(
          id: 'documents',
          title: 'Documents ready',
          subtitle: 'Passport valid, visas obtained',
          icon: Icons.badge,
        ),
      ],
    );
  }

  void updateDestination(String value) {
    state = state.copyWith(destination: value);
  }

  void updateTripDays(int value) {
    state = state.copyWith(tripDays: value);
  }

  void updateTravelType(String value) {
    state = state.copyWith(travelType: value);
  }

  void updateTravelerType(String value) {
    state = state.copyWith(travelerType: value);
  }

  void generateList() {
    final generated = _generateItems(
      state.travelType,
      state.tripDays,
      state.travelerType,
    );

    final items = <PackingItem>[];
    final random = Random();

    generated.forEach((category, names) {
      for (final name in names) {
        items.add(PackingItem(
          id: '${category}_${random.nextInt(999999)}',
          name: name,
          category: category,
        ));
      }
    });

    state = state.copyWith(items: items, isGenerated: true);
  }

  void toggleItem(String id) {
    state = state.copyWith(
      items: state.items.map((item) {
        if (item.id == id) return item.copyWith(isPacked: !item.isPacked);
        return item;
      }).toList(),
    );
  }

  void addCustomItem(String name, String category) {
    final newItem = PackingItem(
      id: 'custom_${Random().nextInt(999999)}',
      name: name,
      category: category,
    );
    state = state.copyWith(items: [...state.items, newItem]);
  }

  void removeItem(String id) {
    state = state.copyWith(
      items: state.items.where((i) => i.id != id).toList(),
    );
  }

  void togglePreTripItem(String id) {
    state = state.copyWith(
      preTripItems: state.preTripItems.map((item) {
        if (item.id == id) {
          item.isCompleted = !item.isCompleted;
        }
        return item;
      }).toList(),
    );
  }

  void resetList() {
    state = _initialState();
  }
}

final packingListProvider =
    StateNotifierProvider<PackingListNotifier, PackingListState>(
  (ref) => PackingListNotifier(),
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

class PackingScreen extends ConsumerStatefulWidget {
  const PackingScreen({super.key});

  @override
  ConsumerState<PackingScreen> createState() => _PackingScreenState();
}

class _PackingScreenState extends ConsumerState<PackingScreen>
    with TickerProviderStateMixin {
  late final TextEditingController _destinationController;
  late final TextEditingController _customItemController;
  String _customItemCategory = 'clothing';
  String? _expandedCategory;
  int _selectedTab = 0; // 0 = packing, 1 = pre-trip, 2 = itinerary

  late final AnimationController _generateAnimController;
  late final Animation<double> _generateAnim;

  final List<DayItinerary> _sampleItinerary = const [
    DayItinerary(day: 1, title: 'Arrival Day', blocks: [
      TimeBlock(time: '09:00', activity: 'Depart from home', icon: Icons.flight_takeoff),
      TimeBlock(time: '13:00', activity: 'Arrive & check in', icon: Icons.hotel),
      TimeBlock(time: '15:00', activity: 'Explore neighbourhood', icon: Icons.explore),
      TimeBlock(time: '19:00', activity: 'Welcome dinner', icon: Icons.restaurant),
    ]),
    DayItinerary(day: 2, title: 'Full Exploration', blocks: [
      TimeBlock(time: '08:00', activity: 'Breakfast at hotel', icon: Icons.free_breakfast),
      TimeBlock(time: '09:30', activity: 'Morning sightseeing', icon: Icons.camera_alt),
      TimeBlock(time: '12:30', activity: 'Lunch at local spot', icon: Icons.lunch_dining),
      TimeBlock(time: '14:00', activity: 'Cultural experience', icon: Icons.temple_buddhist),
      TimeBlock(time: '18:00', activity: 'Sunset viewpoint', icon: Icons.wb_twilight),
      TimeBlock(time: '20:00', activity: 'Night market / street food', icon: Icons.nightlife),
    ]),
    DayItinerary(day: 3, title: 'Departure Day', blocks: [
      TimeBlock(time: '08:00', activity: 'Pack & check out', icon: Icons.luggage),
      TimeBlock(time: '10:00', activity: 'Last-minute shopping', icon: Icons.shopping_bag),
      TimeBlock(time: '13:00', activity: 'Head to airport', icon: Icons.local_taxi),
      TimeBlock(time: '16:00', activity: 'Depart', icon: Icons.flight_land),
    ]),
  ];

  @override
  void initState() {
    super.initState();
    _destinationController = TextEditingController();
    _customItemController = TextEditingController();
    _generateAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _generateAnim = CurvedAnimation(
      parent: _generateAnimController,
      curve: Curves.easeOutBack,
    );
  }

  @override
  void dispose() {
    _destinationController.dispose();
    _customItemController.dispose();
    _generateAnimController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(packingListProvider);
    final notifier = ref.read(packingListProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Packing List'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        actions: [
          if (state.isGenerated)
            IconButton(
              icon: const Icon(Icons.share),
              tooltip: 'Share list',
              onPressed: () => _showShareSheet(context, state),
            ),
          if (state.isGenerated)
            IconButton(
              icon: const Icon(Icons.restart_alt),
              tooltip: 'Reset',
              onPressed: () {
                notifier.resetList();
                _generateAnimController.reset();
              },
            ),
        ],
      ),
      body: state.isGenerated
          ? _buildGeneratedContent(state, notifier)
          : _buildGeneratorForm(state, notifier),
      floatingActionButton: state.isGenerated && _selectedTab == 0
          ? FloatingActionButton.extended(
              onPressed: () => _showAddItemSheet(context, notifier),
              icon: const Icon(Icons.add),
              label: const Text('Add Item'),
            )
          : null,
    );
  }

  // -----------------------------------------------------------------------
  // Generator form
  // -----------------------------------------------------------------------

  Widget _buildGeneratorForm(PackingListState state, PackingListNotifier notifier) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Hero card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppColors.primary, AppColors.primaryLight],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: AppColors.white.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.auto_awesome,
                    color: AppColors.white,
                    size: 32,
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'AI Packing List Generator',
                  style: TextStyle(
                    color: AppColors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Tell us about your trip and we\'ll create\na personalized packing checklist.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: AppColors.white.withValues(alpha: 0.85),
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Destination
          Text(
            'Destination',
            style: Theme.of(context)
                .textTheme
                .titleSmall
                ?.copyWith(fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _destinationController,
            decoration: InputDecoration(
              hintText: 'e.g. Bali, Indonesia',
              prefixIcon: const Icon(Icons.location_on_outlined),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            onChanged: notifier.updateDestination,
          ),
          const SizedBox(height: 20),

          // Trip duration
          Text(
            'Trip Duration',
            style: Theme.of(context)
                .textTheme
                .titleSmall
                ?.copyWith(fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: Slider(
                  value: state.tripDays.toDouble(),
                  min: 1,
                  max: 30,
                  divisions: 29,
                  label: '${state.tripDays} days',
                  activeColor: AppColors.accent,
                  onChanged: (v) => notifier.updateTripDays(v.round()),
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.accent.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '${state.tripDays} days',
                  style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    color: AppColors.accent,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Travel type
          Text(
            'Travel Type',
            style: Theme.of(context)
                .textTheme
                .titleSmall
                ?.copyWith(fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          _TravelTypeSelector(
            selected: state.travelType,
            onChanged: notifier.updateTravelType,
          ),
          const SizedBox(height: 20),

          // Traveler type
          Text(
            'Traveler Type',
            style: Theme.of(context)
                .textTheme
                .titleSmall
                ?.copyWith(fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          _TravelerTypeSelector(
            selected: state.travelerType,
            onChanged: notifier.updateTravelerType,
          ),
          const SizedBox(height: 32),

          // Generate button
          SizedBox(
            width: double.infinity,
            height: 54,
            child: ElevatedButton.icon(
              onPressed: () {
                notifier.generateList();
                _generateAnimController.forward();
                HapticFeedback.mediumImpact();
              },
              icon: const Icon(Icons.auto_awesome, size: 20),
              label: const Text(
                'Generate Packing List',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.accent,
                foregroundColor: AppColors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
                elevation: 0,
              ),
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  // -----------------------------------------------------------------------
  // Generated content with tabs
  // -----------------------------------------------------------------------

  Widget _buildGeneratedContent(
      PackingListState state, PackingListNotifier notifier) {
    return Column(
      children: [
        // Progress header
        _PackingProgressHeader(state: state),

        // Tab bar
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: AppColors.surfaceVariant,
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.all(4),
          child: Row(
            children: [
              _TabButton(
                label: 'Packing',
                icon: Icons.luggage,
                isSelected: _selectedTab == 0,
                onTap: () => setState(() => _selectedTab = 0),
              ),
              _TabButton(
                label: 'Pre-Trip',
                icon: Icons.checklist_rtl,
                isSelected: _selectedTab == 1,
                onTap: () => setState(() => _selectedTab = 1),
              ),
              _TabButton(
                label: 'Itinerary',
                icon: Icons.calendar_today,
                isSelected: _selectedTab == 2,
                onTap: () => setState(() => _selectedTab = 2),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Tab content
        Expanded(
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            child: _selectedTab == 0
                ? _buildPackingTab(state, notifier)
                : _selectedTab == 1
                    ? _buildPreTripTab(state, notifier)
                    : _buildItineraryTab(),
          ),
        ),
      ],
    );
  }

  // -----------------------------------------------------------------------
  // Packing tab
  // -----------------------------------------------------------------------

  Widget _buildPackingTab(PackingListState state, PackingListNotifier notifier) {
    final categories = <String>{};
    for (final item in state.items) {
      categories.add(item.category);
    }

    return FadeTransition(
      opacity: _generateAnim,
      child: ListView.builder(
        key: const ValueKey('packing_tab'),
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final category = categories.elementAt(index);
          final meta = _categoryMeta[category];
          final categoryItems =
              state.items.where((i) => i.category == category).toList();
          final packedInCategory =
              categoryItems.where((i) => i.isPacked).length;
          final isExpanded = _expandedCategory == category;

          return Card(
            margin: const EdgeInsets.only(bottom: 10),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
            ),
            clipBehavior: Clip.antiAlias,
            child: Column(
              children: [
                // Category header
                InkWell(
                  onTap: () {
                    setState(() {
                      _expandedCategory = isExpanded ? null : category;
                    });
                  },
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 14),
                    child: Row(
                      children: [
                        Container(
                          width: 38,
                          height: 38,
                          decoration: BoxDecoration(
                            color: (meta?.color ?? AppColors.primary)
                                .withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(
                            meta?.icon ?? Icons.inventory_2,
                            color: meta?.color ?? AppColors.primary,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                meta?.label ?? category,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                  fontSize: 15,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '$packedInCategory / ${categoryItems.length} packed',
                                style: TextStyle(
                                  color: AppColors.textTertiary,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Mini progress
                        SizedBox(
                          width: 40,
                          height: 40,
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              CircularProgressIndicator(
                                value: categoryItems.isEmpty
                                    ? 0
                                    : packedInCategory / categoryItems.length,
                                strokeWidth: 3,
                                backgroundColor:
                                    AppColors.border,
                                valueColor: AlwaysStoppedAnimation(
                                    meta?.color ?? AppColors.primary),
                              ),
                              Text(
                                '${categoryItems.isEmpty ? 0 : ((packedInCategory / categoryItems.length) * 100).round()}%',
                                style: const TextStyle(
                                    fontSize: 9, fontWeight: FontWeight.w700),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 4),
                        AnimatedRotation(
                          turns: isExpanded ? 0.5 : 0,
                          duration: const Duration(milliseconds: 200),
                          child: const Icon(Icons.expand_more, size: 22),
                        ),
                      ],
                    ),
                  ),
                ),

                // Items
                AnimatedCrossFade(
                  firstChild: const SizedBox.shrink(),
                  secondChild: Column(
                    children: [
                      const Divider(height: 1),
                      ...categoryItems.map(
                        (item) => _PackingItemTile(
                          item: item,
                          color: meta?.color ?? AppColors.primary,
                          onToggle: () {
                            notifier.toggleItem(item.id);
                            if (!item.isPacked) {
                              HapticFeedback.lightImpact();
                            }
                          },
                          onDismissed: () => notifier.removeItem(item.id),
                        ),
                      ),
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
        },
      ),
    );
  }

  // -----------------------------------------------------------------------
  // Pre-trip tab
  // -----------------------------------------------------------------------

  Widget _buildPreTripTab(
      PackingListState state, PackingListNotifier notifier) {
    final completed =
        state.preTripItems.where((i) => i.isCompleted).length;

    return ListView(
      key: const ValueKey('pretrip_tab'),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      children: [
        // Status card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: completed == state.preTripItems.length
                ? AppColors.success.withValues(alpha: 0.08)
                : AppColors.warning.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: completed == state.preTripItems.length
                  ? AppColors.success.withValues(alpha: 0.3)
                  : AppColors.warning.withValues(alpha: 0.3),
            ),
          ),
          child: Row(
            children: [
              Icon(
                completed == state.preTripItems.length
                    ? Icons.check_circle
                    : Icons.pending_actions,
                color: completed == state.preTripItems.length
                    ? AppColors.success
                    : AppColors.warning,
                size: 32,
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      completed == state.preTripItems.length
                          ? 'All set! You\'re ready to go.'
                          : '${state.preTripItems.length - completed} items remaining',
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '$completed of ${state.preTripItems.length} completed',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Pre-trip items
        ...state.preTripItems.map((item) => _PreTripItemCard(
              item: item,
              onToggle: () {
                notifier.togglePreTripItem(item.id);
                HapticFeedback.lightImpact();
              },
            )),
      ],
    );
  }

  // -----------------------------------------------------------------------
  // Itinerary tab
  // -----------------------------------------------------------------------

  Widget _buildItineraryTab() {
    return ListView.builder(
      key: const ValueKey('itinerary_tab'),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: _sampleItinerary.length,
      itemBuilder: (context, index) {
        final day = _sampleItinerary[index];
        return _DayCard(day: day);
      },
    );
  }

  // -----------------------------------------------------------------------
  // Add custom item sheet
  // -----------------------------------------------------------------------

  void _showAddItemSheet(BuildContext context, PackingListNotifier notifier) {
    _customItemController.clear();
    _customItemCategory = 'clothing';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Padding(
          padding: EdgeInsets.fromLTRB(
              24, 24, 24, MediaQuery.of(ctx).viewInsets.bottom + 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Add Custom Item',
                style: Theme.of(ctx)
                    .textTheme
                    .titleLarge
                    ?.copyWith(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _customItemController,
                autofocus: true,
                decoration: InputDecoration(
                  hintText: 'Item name',
                  prefixIcon: const Icon(Icons.inventory_2_outlined),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              Text(
                'Category',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                  fontSize: 13,
                ),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _categoryMeta.entries.map((entry) {
                  final isSelected = _customItemCategory == entry.key;
                  return ChoiceChip(
                    selected: isSelected,
                    onSelected: (_) {
                      setSheetState(
                          () => _customItemCategory = entry.key);
                    },
                    avatar: Icon(entry.value.icon,
                        size: 16, color: entry.value.color),
                    label: Text(entry.value.label),
                    selectedColor: entry.value.color.withValues(alpha: 0.15),
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    final text = _customItemController.text.trim();
                    if (text.isNotEmpty) {
                      notifier.addCustomItem(text, _customItemCategory);
                      Navigator.pop(ctx);
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: AppColors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text('Add Item'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // -----------------------------------------------------------------------
  // Share sheet
  // -----------------------------------------------------------------------

  void _showShareSheet(BuildContext context, PackingListState state) {
    final buffer = StringBuffer();
    buffer.writeln('Packing List for ${state.destination.isEmpty ? "My Trip" : state.destination}');
    buffer.writeln('${state.tripDays} days | ${state.travelType}');
    buffer.writeln('${'=' * 40}');

    final categories = <String>{};
    for (final item in state.items) {
      categories.add(item.category);
    }

    for (final category in categories) {
      final meta = _categoryMeta[category];
      buffer.writeln('\n${meta?.label ?? category}');
      buffer.writeln('-' * 20);
      for (final item
          in state.items.where((i) => i.category == category)) {
        buffer.writeln('${item.isPacked ? "[x]" : "[ ]"} ${item.name}');
      }
    }

    buffer.writeln('\n${state.packedCount} / ${state.items.length} packed');

    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.share, size: 40, color: AppColors.primary),
            const SizedBox(height: 12),
            Text(
              'Share Packing List',
              style: Theme.of(ctx)
                  .textTheme
                  .titleLarge
                  ?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 8),
            Text(
              'Your list has been copied to clipboard!',
              style: TextStyle(color: AppColors.textSecondary),
            ),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.surfaceVariant,
                borderRadius: BorderRadius.circular(12),
              ),
              constraints: const BoxConstraints(maxHeight: 200),
              child: SingleChildScrollView(
                child: Text(
                  buffer.toString(),
                  style: const TextStyle(
                      fontFamily: 'monospace', fontSize: 12),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Clipboard.setData(
                          ClipboardData(text: buffer.toString()));
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Copied to clipboard!'),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
                    icon: const Icon(Icons.copy, size: 18),
                    label: const Text('Copy'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.pop(ctx),
                    icon: const Icon(Icons.check, size: 18),
                    label: const Text('Done'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: AppColors.white,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ===========================================================================
// Private widgets
// ===========================================================================

// ---------------------------------------------------------------------------
// Travel type selector
// ---------------------------------------------------------------------------

class _TravelTypeSelector extends StatelessWidget {
  final String selected;
  final ValueChanged<String> onChanged;

  const _TravelTypeSelector({
    required this.selected,
    required this.onChanged,
  });

  static const _types = [
    {'id': 'beach', 'label': 'Beach', 'icon': Icons.beach_access},
    {'id': 'mountain', 'label': 'Mountain', 'icon': Icons.terrain},
    {'id': 'city', 'label': 'City', 'icon': Icons.location_city},
    {'id': 'desert', 'label': 'Desert', 'icon': Icons.wb_sunny},
  ];

  @override
  Widget build(BuildContext context) {
    return Row(
      children: _types.map((type) {
        final isSelected = selected == type['id'];
        return Expanded(
          child: GestureDetector(
            onTap: () => onChanged(type['id'] as String),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: EdgeInsets.only(
                  right: type != _types.last ? 10 : 0),
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppColors.accent.withValues(alpha: 0.1)
                    : AppColors.surfaceVariant,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected
                      ? AppColors.accent
                      : AppColors.border,
                  width: isSelected ? 1.5 : 1,
                ),
              ),
              child: Column(
                children: [
                  Icon(
                    type['icon'] as IconData,
                    color: isSelected
                        ? AppColors.accent
                        : AppColors.textSecondary,
                    size: 24,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    type['label'] as String,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight:
                          isSelected ? FontWeight.w600 : FontWeight.w400,
                      color: isSelected
                          ? AppColors.accent
                          : AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}

// ---------------------------------------------------------------------------
// Traveler type selector
// ---------------------------------------------------------------------------

class _TravelerTypeSelector extends StatelessWidget {
  final String selected;
  final ValueChanged<String> onChanged;

  const _TravelerTypeSelector({
    required this.selected,
    required this.onChanged,
  });

  static const _types = [
    {'id': 'casual', 'label': 'Casual', 'icon': Icons.person},
    {'id': 'minimalist', 'label': 'Minimalist', 'icon': Icons.backpack},
    {'id': 'photographer', 'label': 'Photographer', 'icon': Icons.camera_alt},
    {'id': 'content-creator', 'label': 'Creator', 'icon': Icons.videocam},
  ];

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: _types.map((type) {
        final isSelected = selected == type['id'];
        return ChoiceChip(
          selected: isSelected,
          onSelected: (_) => onChanged(type['id'] as String),
          avatar: Icon(type['icon'] as IconData, size: 16),
          label: Text(type['label'] as String),
          selectedColor: AppColors.primary.withValues(alpha: 0.12),
          labelStyle: TextStyle(
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
            color: isSelected ? AppColors.primary : AppColors.textSecondary,
          ),
        );
      }).toList(),
    );
  }
}

// ---------------------------------------------------------------------------
// Progress header
// ---------------------------------------------------------------------------

class _PackingProgressHeader extends StatelessWidget {
  final PackingListState state;

  const _PackingProgressHeader({required this.state});

  @override
  Widget build(BuildContext context) {
    final pct = (state.packedProgress * 100).round();

    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: pct == 100
              ? [AppColors.success, const Color(0xFF059669)]
              : [AppColors.primary, AppColors.primaryLight],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  pct == 100 ? 'All Packed!' : 'Packing Progress',
                  style: const TextStyle(
                    color: AppColors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 18,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${state.packedCount} of ${state.items.length} items packed',
                  style: TextStyle(
                    color: AppColors.white.withValues(alpha: 0.8),
                    fontSize: 14,
                  ),
                ),
                if (state.destination.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text(
                    '${state.destination} - ${state.tripDays} days',
                    style: TextStyle(
                      color: AppColors.white.withValues(alpha: 0.7),
                      fontSize: 12,
                    ),
                  ),
                ],
                const SizedBox(height: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: TweenAnimationBuilder<double>(
                    tween: Tween(begin: 0, end: state.packedProgress),
                    duration: const Duration(milliseconds: 500),
                    curve: Curves.easeOut,
                    builder: (context, value, _) {
                      return LinearProgressIndicator(
                        value: value,
                        backgroundColor:
                            AppColors.white.withValues(alpha: 0.2),
                        valueColor:
                            const AlwaysStoppedAnimation(AppColors.accent),
                        minHeight: 6,
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          SizedBox(
            width: 56,
            height: 56,
            child: Stack(
              alignment: Alignment.center,
              children: [
                CircularProgressIndicator(
                  value: state.packedProgress,
                  strokeWidth: 4,
                  backgroundColor: AppColors.white.withValues(alpha: 0.2),
                  valueColor:
                      const AlwaysStoppedAnimation(AppColors.accent),
                ),
                Text(
                  '$pct%',
                  style: const TextStyle(
                    color: AppColors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
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
// Tab button
// ---------------------------------------------------------------------------

class _TabButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _TabButton({
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.06),
                      blurRadius: 4,
                      offset: const Offset(0, 1),
                    ),
                  ]
                : null,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 16,
                color: isSelected
                    ? AppColors.primary
                    : AppColors.textTertiary,
              ),
              const SizedBox(width: 6),
              Text(
                label,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight:
                      isSelected ? FontWeight.w600 : FontWeight.w400,
                  color: isSelected
                      ? AppColors.primary
                      : AppColors.textTertiary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Packing item tile with check animation
// ---------------------------------------------------------------------------

class _PackingItemTile extends StatefulWidget {
  final PackingItem item;
  final Color color;
  final VoidCallback onToggle;
  final VoidCallback onDismissed;

  const _PackingItemTile({
    required this.item,
    required this.color,
    required this.onToggle,
    required this.onDismissed,
  });

  @override
  State<_PackingItemTile> createState() => _PackingItemTileState();
}

class _PackingItemTileState extends State<_PackingItemTile>
    with SingleTickerProviderStateMixin {
  late final AnimationController _animController;
  late final Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    );
    _scaleAnim = TweenSequence([
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 1.3), weight: 50),
      TweenSequenceItem(tween: Tween(begin: 1.3, end: 1.0), weight: 50),
    ]).animate(CurvedAnimation(
      parent: _animController,
      curve: Curves.easeInOut,
    ));

    if (widget.item.isPacked) {
      _animController.value = 1.0;
    }
  }

  @override
  void didUpdateWidget(covariant _PackingItemTile oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.item.isPacked != oldWidget.item.isPacked) {
      if (widget.item.isPacked) {
        _animController.forward(from: 0);
      } else {
        _animController.reverse();
      }
    }
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: ValueKey(widget.item.id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        color: AppColors.error.withValues(alpha: 0.1),
        child: const Icon(Icons.delete_outline, color: AppColors.error),
      ),
      onDismissed: (_) => widget.onDismissed(),
      child: InkWell(
        onTap: widget.onToggle,
        child: Padding(
          padding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              // Animated checkbox
              ScaleTransition(
                scale: _scaleAnim,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  width: 26,
                  height: 26,
                  decoration: BoxDecoration(
                    color: widget.item.isPacked
                        ? widget.color
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(7),
                    border: Border.all(
                      color: widget.item.isPacked
                          ? widget.color
                          : AppColors.border,
                      width: 2,
                    ),
                  ),
                  child: widget.item.isPacked
                      ? const Icon(Icons.check,
                          size: 16, color: AppColors.white)
                      : null,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: AnimatedDefaultTextStyle(
                  duration: const Duration(milliseconds: 250),
                  style: TextStyle(
                    fontSize: 14,
                    color: widget.item.isPacked
                        ? AppColors.textTertiary
                        : AppColors.textPrimary,
                    decoration: widget.item.isPacked
                        ? TextDecoration.lineThrough
                        : TextDecoration.none,
                    decorationColor: AppColors.textTertiary,
                  ),
                  child: Text(widget.item.name),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Pre-trip item card
// ---------------------------------------------------------------------------

class _PreTripItemCard extends StatelessWidget {
  final PreTripItem item;
  final VoidCallback onToggle;

  const _PreTripItemCard({
    required this.item,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onToggle,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeOutBack,
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: item.isCompleted
                      ? AppColors.success.withValues(alpha: 0.12)
                      : AppColors.surfaceVariant,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  item.isCompleted ? Icons.check_circle : item.icon,
                  color: item.isCompleted
                      ? AppColors.success
                      : AppColors.textSecondary,
                  size: 24,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.title,
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 15,
                        decoration: item.isCompleted
                            ? TextDecoration.lineThrough
                            : null,
                        color: item.isCompleted
                            ? AppColors.textTertiary
                            : AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      item.subtitle,
                      style: TextStyle(
                        color: AppColors.textTertiary,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
              AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: item.isCompleted
                      ? AppColors.success
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color:
                        item.isCompleted ? AppColors.success : AppColors.border,
                    width: 2,
                  ),
                ),
                child: item.isCompleted
                    ? const Icon(Icons.check,
                        size: 16, color: AppColors.white)
                    : null,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Day itinerary card
// ---------------------------------------------------------------------------

class _DayCard extends StatelessWidget {
  final DayItinerary day;

  const _DayCard({required this.day});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.accent.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    'Day ${day.day}',
                    style: const TextStyle(
                      color: AppColors.accent,
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  day.title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Time blocks
            ...day.blocks.asMap().entries.map((entry) {
              final idx = entry.key;
              final block = entry.value;
              final isLast = idx == day.blocks.length - 1;

              return IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Timeline
                    SizedBox(
                      width: 24,
                      child: Column(
                        children: [
                          Container(
                            width: 10,
                            height: 10,
                            decoration: BoxDecoration(
                              color: AppColors.accent,
                              shape: BoxShape.circle,
                            ),
                          ),
                          if (!isLast)
                            Expanded(
                              child: Container(
                                width: 2,
                                color: AppColors.border,
                              ),
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 10),
                    // Content
                    Expanded(
                      child: Padding(
                        padding: EdgeInsets.only(
                            bottom: isLast ? 0 : 16),
                        child: Row(
                          children: [
                            Text(
                              block.time,
                              style: TextStyle(
                                color: AppColors.textTertiary,
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Icon(block.icon,
                                size: 18,
                                color: AppColors.textSecondary),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                block.activity,
                                style: const TextStyle(fontSize: 14),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
