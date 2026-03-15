import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

final _selectedDestinationProvider = StateProvider<String>((ref) => 'Thailand');

final _vaccinationRecordsProvider =
    StateNotifierProvider<_VaccinationRecordNotifier, List<VaccinationRecord>>(
  (ref) => _VaccinationRecordNotifier(),
);

final _insurancePolicyProvider =
    StateNotifierProvider<_InsurancePolicyNotifier, InsurancePolicy?>(
  (ref) => _InsurancePolicyNotifier(),
);

final _pharmacyFilterProvider = StateProvider<bool>((ref) => false);

final _drugSearchProvider = StateProvider<String>((ref) => '');

final _medicationRemindersProvider =
    StateNotifierProvider<_MedicationReminderNotifier, List<MedicationReminder>>(
  (ref) => _MedicationReminderNotifier(),
);

// ---------------------------------------------------------------------------
// Models
// ---------------------------------------------------------------------------

class VaccinationRecord {
  final String id;
  final String name;
  final DateTime dateAdministered;
  final String brand;
  final DateTime? nextBoosterDue;

  const VaccinationRecord({
    required this.id,
    required this.name,
    required this.dateAdministered,
    required this.brand,
    this.nextBoosterDue,
  });

  VaccinationRecord copyWith({
    String? id,
    String? name,
    DateTime? dateAdministered,
    String? brand,
    DateTime? nextBoosterDue,
  }) {
    return VaccinationRecord(
      id: id ?? this.id,
      name: name ?? this.name,
      dateAdministered: dateAdministered ?? this.dateAdministered,
      brand: brand ?? this.brand,
      nextBoosterDue: nextBoosterDue ?? this.nextBoosterDue,
    );
  }
}

class InsurancePolicy {
  final String policyNumber;
  final String insurer;
  final DateTime coverageStart;
  final DateTime coverageEnd;
  final String emergencyHelpline;
  final Map<String, bool> coverageTypes;

  const InsurancePolicy({
    required this.policyNumber,
    required this.insurer,
    required this.coverageStart,
    required this.coverageEnd,
    required this.emergencyHelpline,
    required this.coverageTypes,
  });
}

class MedicationReminder {
  final String id;
  final String medicineName;
  final String dosage;
  final TimeOfDay time;
  final bool isActive;

  const MedicationReminder({
    required this.id,
    required this.medicineName,
    required this.dosage,
    required this.time,
    this.isActive = true,
  });
}

// ---------------------------------------------------------------------------
// State Notifiers
// ---------------------------------------------------------------------------

class _VaccinationRecordNotifier extends StateNotifier<List<VaccinationRecord>> {
  _VaccinationRecordNotifier()
      : super([
          VaccinationRecord(
            id: '1',
            name: 'COVID-19',
            dateAdministered: DateTime(2024, 3, 15),
            brand: 'Pfizer-BioNTech',
            nextBoosterDue: DateTime(2025, 9, 15),
          ),
          VaccinationRecord(
            id: '2',
            name: 'Hepatitis A',
            dateAdministered: DateTime(2023, 11, 20),
            brand: 'Havrix',
            nextBoosterDue: DateTime(2024, 5, 20),
          ),
          VaccinationRecord(
            id: '3',
            name: 'Typhoid',
            dateAdministered: DateTime(2024, 1, 10),
            brand: 'Typhim Vi',
            nextBoosterDue: DateTime(2026, 1, 10),
          ),
        ]);

  void add(VaccinationRecord record) {
    state = [...state, record];
  }

  void remove(String id) {
    state = state.where((r) => r.id != id).toList();
  }
}

class _InsurancePolicyNotifier extends StateNotifier<InsurancePolicy?> {
  _InsurancePolicyNotifier()
      : super(InsurancePolicy(
          policyNumber: 'TRV-2026-4851920',
          insurer: 'World Nomads',
          coverageStart: DateTime(2026, 3, 1),
          coverageEnd: DateTime(2026, 6, 30),
          emergencyHelpline: '+1-800-SAFE-TRIP',
          coverageTypes: {
            'Medical Expenses': true,
            'Emergency Evacuation': true,
            'Trip Cancellation': true,
            'Lost Baggage': true,
            'Dental Emergency': false,
            'Adventure Sports': false,
            'Pre-existing Conditions': false,
          },
        ));

  void update(InsurancePolicy policy) {
    state = policy;
  }

  void clear() {
    state = null;
  }
}

class _MedicationReminderNotifier extends StateNotifier<List<MedicationReminder>> {
  _MedicationReminderNotifier()
      : super([
          MedicationReminder(
            id: '1',
            medicineName: 'Malarone',
            dosage: '1 tablet',
            time: const TimeOfDay(hour: 8, minute: 0),
          ),
          MedicationReminder(
            id: '2',
            medicineName: 'Vitamin D',
            dosage: '1000 IU',
            time: const TimeOfDay(hour: 9, minute: 0),
          ),
        ]);

  void add(MedicationReminder reminder) {
    state = [...state, reminder];
  }

  void toggle(String id) {
    state = state
        .map((r) => r.id == id
            ? MedicationReminder(
                id: r.id,
                medicineName: r.medicineName,
                dosage: r.dosage,
                time: r.time,
                isActive: !r.isActive,
              )
            : r)
        .toList();
  }

  void remove(String id) {
    state = state.where((r) => r.id != id).toList();
  }
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const _destinationVaccines = <String, Map<String, List<Map<String, String>>>>{
  'Thailand': {
    'required': [
      {'name': 'Yellow Fever', 'note': 'If arriving from endemic area'},
    ],
    'recommended': [
      {'name': 'Hepatitis A', 'note': 'Food & water-borne'},
      {'name': 'Hepatitis B', 'note': 'Blood & body fluids'},
      {'name': 'Typhoid', 'note': 'Contaminated food/water'},
      {'name': 'Japanese Encephalitis', 'note': 'Mosquito-borne, rural areas'},
      {'name': 'Rabies', 'note': 'Animal bites, rural travel'},
    ],
  },
  'India': {
    'required': [
      {'name': 'Yellow Fever', 'note': 'If arriving from endemic area'},
      {'name': 'Polio', 'note': 'OPV booster recommended'},
    ],
    'recommended': [
      {'name': 'Hepatitis A', 'note': 'Food & water-borne'},
      {'name': 'Hepatitis B', 'note': 'Blood & body fluids'},
      {'name': 'Typhoid', 'note': 'Common in South Asia'},
      {'name': 'Malaria Prophylaxis', 'note': 'Depending on region'},
      {'name': 'Japanese Encephalitis', 'note': 'Rural & semi-urban areas'},
    ],
  },
  'Kenya': {
    'required': [
      {'name': 'Yellow Fever', 'note': 'Certificate required for entry'},
    ],
    'recommended': [
      {'name': 'Hepatitis A', 'note': 'Food & water-borne'},
      {'name': 'Typhoid', 'note': 'Contaminated food/water'},
      {'name': 'Malaria Prophylaxis', 'note': 'High risk across country'},
      {'name': 'Meningococcal', 'note': 'Meningitis belt proximity'},
      {'name': 'Cholera', 'note': 'Outbreaks possible'},
    ],
  },
  'Brazil': {
    'required': [
      {'name': 'Yellow Fever', 'note': 'Required for most regions'},
    ],
    'recommended': [
      {'name': 'Hepatitis A', 'note': 'Food & water-borne'},
      {'name': 'Typhoid', 'note': 'Contaminated food/water'},
      {'name': 'Rabies', 'note': 'Animal exposure risk'},
      {'name': 'Malaria Prophylaxis', 'note': 'Amazon region'},
    ],
  },
  'Japan': {
    'required': [],
    'recommended': [
      {'name': 'Hepatitis A', 'note': 'Standard precaution'},
      {'name': 'Hepatitis B', 'note': 'If extended stay'},
      {'name': 'Japanese Encephalitis', 'note': 'Seasonal risk in rural areas'},
    ],
  },
};

const _pharmacies = <Map<String, dynamic>>[
  {
    'name': 'MedPlus Pharmacy',
    'distance': '0.4 km',
    'open': true,
    'is24hr': true,
    'rating': '4.3',
    'address': '12 Main St, City Center',
  },
  {
    'name': 'Apollo Pharmacy',
    'distance': '1.1 km',
    'open': true,
    'is24hr': true,
    'rating': '4.5',
    'address': '45 Health Ave, Downtown',
  },
  {
    'name': 'Wellness Drugstore',
    'distance': '1.8 km',
    'open': true,
    'is24hr': false,
    'rating': '4.0',
    'address': '78 Park Road, Sector 5',
  },
  {
    'name': 'CareFirst Pharmacy',
    'distance': '2.5 km',
    'open': false,
    'is24hr': false,
    'rating': '3.8',
    'address': '90 Station Rd, Old Town',
  },
  {
    'name': 'LifeLine Medical Store',
    'distance': '3.2 km',
    'open': true,
    'is24hr': true,
    'rating': '4.6',
    'address': '22 Hospital Rd, Medical District',
  },
];

const _drugTranslations = <String, Map<String, String>>{
  'tylenol': {'generic': 'Acetaminophen (Paracetamol)', 'use': 'Pain relief, fever reducer'},
  'advil': {'generic': 'Ibuprofen', 'use': 'Anti-inflammatory, pain relief'},
  'motrin': {'generic': 'Ibuprofen', 'use': 'Anti-inflammatory, pain relief'},
  'aleve': {'generic': 'Naproxen Sodium', 'use': 'Anti-inflammatory, pain relief'},
  'benadryl': {'generic': 'Diphenhydramine', 'use': 'Antihistamine, allergy relief'},
  'zyrtec': {'generic': 'Cetirizine', 'use': 'Non-drowsy antihistamine'},
  'claritin': {'generic': 'Loratadine', 'use': 'Non-drowsy antihistamine'},
  'imodium': {'generic': 'Loperamide', 'use': 'Anti-diarrheal'},
  'pepto-bismol': {'generic': 'Bismuth Subsalicylate', 'use': 'Upset stomach, diarrhea'},
  'zantac': {'generic': 'Ranitidine', 'use': 'Acid reducer (H2 blocker)'},
  'prilosec': {'generic': 'Omeprazole', 'use': 'Proton pump inhibitor, acid reflux'},
  'ambien': {'generic': 'Zolpidem', 'use': 'Sleep aid (prescription)'},
  'lipitor': {'generic': 'Atorvastatin', 'use': 'Cholesterol-lowering statin'},
  'zithromax': {'generic': 'Azithromycin', 'use': 'Antibiotic (prescription)'},
  'augmentin': {'generic': 'Amoxicillin + Clavulanate', 'use': 'Antibiotic (prescription)'},
  'malarone': {'generic': 'Atovaquone + Proguanil', 'use': 'Malaria prophylaxis'},
  'diamox': {'generic': 'Acetazolamide', 'use': 'Altitude sickness prevention'},
};

const _firstAidGuides = <Map<String, dynamic>>[
  {
    'title': 'Food Poisoning',
    'icon': Icons.lunch_dining,
    'color': 0xFFF97316,
    'symptoms': [
      'Nausea and vomiting',
      'Stomach cramps and diarrhea',
      'Fever and chills',
      'Weakness and fatigue',
    ],
    'steps': [
      'Stay hydrated - sip water, ORS, or clear broth frequently',
      'Rest your stomach - avoid solid food for a few hours',
      'Start with bland foods (BRAT: bananas, rice, applesauce, toast)',
      'Avoid dairy, caffeine, alcohol, and fatty foods',
      'Take OTC anti-diarrheal (Loperamide) if no fever/blood in stool',
      'Seek medical help if symptoms last >48 hrs or you see blood',
    ],
  },
  {
    'title': 'Altitude Sickness',
    'icon': Icons.terrain,
    'color': 0xFF6366F1,
    'symptoms': [
      'Headache that worsens with exertion',
      'Nausea, dizziness, fatigue',
      'Shortness of breath during activity',
      'Difficulty sleeping',
    ],
    'steps': [
      'Stop ascending immediately - rest at current altitude',
      'Hydrate well - drink 3-4 liters of water daily',
      'Take Acetazolamide (Diamox) if available (prescription)',
      'Ibuprofen or Paracetamol for headache relief',
      'Descend 300-500m if symptoms worsen within 24 hours',
      'Emergency descent + seek medical help for confusion, ataxia, or severe breathlessness',
    ],
  },
  {
    'title': 'Sunburn',
    'icon': Icons.wb_sunny,
    'color': 0xFFEF4444,
    'symptoms': [
      'Red, hot, tender skin',
      'Swelling and blistering (severe)',
      'Headache, fever, chills (sun poisoning)',
      'Peeling after a few days',
    ],
    'steps': [
      'Get out of the sun immediately and stay in shade/indoors',
      'Cool the skin with lukewarm (not cold) compresses',
      'Apply pure aloe vera gel or after-sun moisturizer',
      'Take Ibuprofen to reduce pain and inflammation',
      'Drink plenty of water - sunburn causes dehydration',
      'Do NOT pop blisters - cover loosely with gauze if needed',
      'Seek medical help for blisters over large area, high fever, or confusion',
    ],
  },
  {
    'title': 'Dehydration',
    'icon': Icons.water_drop,
    'color': 0xFF3B82F6,
    'symptoms': [
      'Thirst and dry mouth',
      'Dark yellow urine, reduced urination',
      'Dizziness and lightheadedness',
      'Fatigue and rapid heartbeat',
    ],
    'steps': [
      'Sip fluids slowly and frequently - don\'t gulp large amounts',
      'Use ORS (Oral Rehydration Salts) for best absorption',
      'DIY ORS: 1L water + 6 tsp sugar + 0.5 tsp salt',
      'Avoid caffeine, alcohol, and sugary sodas',
      'Rest in a cool, shaded area',
      'If unable to keep fluids down, seek medical attention for IV fluids',
    ],
  },
  {
    'title': 'Insect Bites & Stings',
    'icon': Icons.bug_report,
    'color': 0xFF10B981,
    'symptoms': [
      'Redness, swelling, itching at bite site',
      'Pain or burning sensation',
      'Possible allergic reaction (hives, swelling beyond bite)',
      'Rare: difficulty breathing, anaphylaxis',
    ],
    'steps': [
      'Remove stinger if present by scraping sideways (don\'t squeeze)',
      'Wash the area with soap and water',
      'Apply cold compress for 10-15 minutes to reduce swelling',
      'Take antihistamine (Cetirizine/Diphenhydramine) for itching',
      'Apply hydrocortisone cream or calamine lotion',
      'Use EpiPen and call emergency if signs of anaphylaxis appear',
    ],
  },
  {
    'title': 'Motion Sickness',
    'icon': Icons.directions_boat,
    'color': 0xFF8B5CF6,
    'symptoms': [
      'Nausea and vomiting',
      'Dizziness and cold sweats',
      'Pale skin and headache',
      'Increased saliva production',
    ],
    'steps': [
      'Focus on the horizon or a fixed point in the distance',
      'Sit in the front seat (car) or over the wing (plane)',
      'Get fresh air - open a window or step on deck',
      'Take Dimenhydrinate (Dramamine) 30 min before travel',
      'Try ginger tablets, ginger tea, or ginger candies',
      'Avoid reading or screen time during movement',
    ],
  },
];

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

class HealthScreen extends ConsumerStatefulWidget {
  const HealthScreen({super.key});

  @override
  ConsumerState<HealthScreen> createState() => _HealthScreenState();
}

class _HealthScreenState extends ConsumerState<HealthScreen>
    with TickerProviderStateMixin {
  late final TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Health & Vaccination'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        backgroundColor: AppColors.success.withValues(alpha: 0.05),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          tabAlignment: TabAlignment.start,
          tabs: const [
            Tab(icon: Icon(Icons.vaccines, size: 20), text: 'Vaccinations'),
            Tab(icon: Icon(Icons.shield, size: 20), text: 'Insurance'),
            Tab(icon: Icon(Icons.local_pharmacy, size: 20), text: 'Pharmacy'),
            Tab(icon: Icon(Icons.medical_services, size: 20), text: 'First Aid'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: const [
          _VaccinationsTab(),
          _InsuranceTab(),
          _PharmacyTab(),
          _FirstAidTab(),
        ],
      ),
    );
  }
}

// ===========================================================================
// TAB 1 - Vaccinations
// ===========================================================================

class _VaccinationsTab extends ConsumerWidget {
  const _VaccinationsTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final destination = ref.watch(_selectedDestinationProvider);
    final records = ref.watch(_vaccinationRecordsProvider);
    final reminders = ref.watch(_medicationRemindersProvider);
    final destinations = _destinationVaccines.keys.toList();
    final vaccineData = _destinationVaccines[destination];
    final required = vaccineData?['required'] ?? [];
    final recommended = vaccineData?['recommended'] ?? [];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ---- Destination Vaccine Requirements ----
          Text(
            'Vaccination Requirements',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 40,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: destinations.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final d = destinations[index];
                final selected = d == destination;
                return ChoiceChip(
                  selected: selected,
                  onSelected: (_) =>
                      ref.read(_selectedDestinationProvider.notifier).state = d,
                  label: Text(d),
                  selectedColor: AppColors.primary.withValues(alpha: 0.12),
                  labelStyle: TextStyle(
                    color: selected ? AppColors.primary : AppColors.textSecondary,
                    fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 16),

          // Required
          if (required.isNotEmpty) ...[
            _SectionLabel(
              icon: Icons.warning_amber_rounded,
              label: 'Required',
              color: AppColors.error,
            ),
            const SizedBox(height: 8),
            ...required.map((v) => _VaccineRequirementTile(
                  name: v['name']!,
                  note: v['note']!,
                  isRequired: true,
                )),
            const SizedBox(height: 16),
          ] else ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.success.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.success.withValues(alpha: 0.3)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.check_circle, color: AppColors.success, size: 20),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'No mandatory vaccinations required for entry.',
                      style: TextStyle(fontSize: 13, color: AppColors.success),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],

          // Recommended
          if (recommended.isNotEmpty) ...[
            _SectionLabel(
              icon: Icons.recommend,
              label: 'Recommended',
              color: AppColors.info,
            ),
            const SizedBox(height: 8),
            ...recommended.map((v) => _VaccineRequirementTile(
                  name: v['name']!,
                  note: v['note']!,
                  isRequired: false,
                )),
          ],
          const SizedBox(height: 28),

          // ---- My Vaccination Record ----
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'My Vaccination Record',
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(fontWeight: FontWeight.w700),
              ),
              TextButton.icon(
                onPressed: () => _showAddVaccineDialog(context, ref),
                icon: const Icon(Icons.add, size: 18),
                label: const Text('Add'),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (records.isEmpty)
            _EmptyState(
              icon: Icons.vaccines,
              message: 'No vaccination records yet.\nTap + to add your first record.',
            )
          else
            ...records.map((r) => _VaccinationRecordCard(record: r)),
          const SizedBox(height: 28),

          // ---- Digital Vaccination Card ----
          Text(
            'Digital Vaccination Card',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          _DigitalVaccinationCard(records: records),
          const SizedBox(height: 28),

          // ---- Medication Reminders ----
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Medication Reminders',
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(fontWeight: FontWeight.w700),
              ),
              TextButton.icon(
                onPressed: () => _showAddReminderDialog(context, ref),
                icon: const Icon(Icons.alarm_add, size: 18),
                label: const Text('Add'),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (reminders.isEmpty)
            _EmptyState(
              icon: Icons.alarm,
              message: 'No medication reminders set.',
            )
          else
            ...reminders.map((r) => _MedicationReminderTile(reminder: r)),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  void _showAddVaccineDialog(BuildContext context, WidgetRef ref) {
    final nameCtrl = TextEditingController();
    final brandCtrl = TextEditingController();
    DateTime? selectedDate;
    DateTime? boosterDate;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setModalState) {
            return Padding(
              padding: EdgeInsets.fromLTRB(
                  20, 20, 20, MediaQuery.of(ctx).viewInsets.bottom + 20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: AppColors.disabled,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Add Vaccination Record',
                    style: Theme.of(ctx)
                        .textTheme
                        .titleMedium
                        ?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: nameCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Vaccine Name',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.vaccines),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: brandCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Brand / Manufacturer',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.business),
                    ),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: () async {
                      final picked = await showDatePicker(
                        context: ctx,
                        initialDate: DateTime.now(),
                        firstDate: DateTime(2000),
                        lastDate: DateTime.now(),
                      );
                      if (picked != null) {
                        setModalState(() => selectedDate = picked);
                      }
                    },
                    icon: const Icon(Icons.calendar_today, size: 18),
                    label: Text(
                      selectedDate != null
                          ? '${selectedDate!.day}/${selectedDate!.month}/${selectedDate!.year}'
                          : 'Date Administered',
                    ),
                  ),
                  const SizedBox(height: 8),
                  OutlinedButton.icon(
                    onPressed: () async {
                      final picked = await showDatePicker(
                        context: ctx,
                        initialDate:
                            DateTime.now().add(const Duration(days: 180)),
                        firstDate: DateTime.now(),
                        lastDate: DateTime(2035),
                      );
                      if (picked != null) {
                        setModalState(() => boosterDate = picked);
                      }
                    },
                    icon: const Icon(Icons.event_repeat, size: 18),
                    label: Text(
                      boosterDate != null
                          ? 'Booster: ${boosterDate!.day}/${boosterDate!.month}/${boosterDate!.year}'
                          : 'Next Booster Due (optional)',
                    ),
                  ),
                  const SizedBox(height: 16),
                  FilledButton(
                    onPressed: () {
                      if (nameCtrl.text.isNotEmpty &&
                          brandCtrl.text.isNotEmpty &&
                          selectedDate != null) {
                        ref.read(_vaccinationRecordsProvider.notifier).add(
                              VaccinationRecord(
                                id: DateTime.now().millisecondsSinceEpoch.toString(),
                                name: nameCtrl.text,
                                dateAdministered: selectedDate!,
                                brand: brandCtrl.text,
                                nextBoosterDue: boosterDate,
                              ),
                            );
                        Navigator.pop(ctx);
                      }
                    },
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: const Text('Save Record'),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showAddReminderDialog(BuildContext context, WidgetRef ref) {
    final nameCtrl = TextEditingController();
    final dosageCtrl = TextEditingController();
    TimeOfDay? selectedTime;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setModalState) {
            return Padding(
              padding: EdgeInsets.fromLTRB(
                  20, 20, 20, MediaQuery.of(ctx).viewInsets.bottom + 20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: AppColors.disabled,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Add Medication Reminder',
                    style: Theme.of(ctx)
                        .textTheme
                        .titleMedium
                        ?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: nameCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Medicine Name',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.medication),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: dosageCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Dosage (e.g. 1 tablet, 500mg)',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.scale),
                    ),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: () async {
                      final picked = await showTimePicker(
                        context: ctx,
                        initialTime: const TimeOfDay(hour: 8, minute: 0),
                      );
                      if (picked != null) {
                        setModalState(() => selectedTime = picked);
                      }
                    },
                    icon: const Icon(Icons.access_time, size: 18),
                    label: Text(
                      selectedTime != null
                          ? selectedTime!.format(ctx)
                          : 'Set Reminder Time',
                    ),
                  ),
                  const SizedBox(height: 16),
                  FilledButton(
                    onPressed: () {
                      if (nameCtrl.text.isNotEmpty &&
                          dosageCtrl.text.isNotEmpty &&
                          selectedTime != null) {
                        ref.read(_medicationRemindersProvider.notifier).add(
                              MedicationReminder(
                                id: DateTime.now().millisecondsSinceEpoch.toString(),
                                medicineName: nameCtrl.text,
                                dosage: dosageCtrl.text,
                                time: selectedTime!,
                              ),
                            );
                        Navigator.pop(ctx);
                      }
                    },
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: const Text('Save Reminder'),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}

// ===========================================================================
// TAB 2 - Insurance
// ===========================================================================

class _InsuranceTab extends ConsumerWidget {
  const _InsuranceTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final policy = ref.watch(_insurancePolicyProvider);

    if (policy == null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.shield_outlined,
                  size: 72, color: AppColors.textTertiary),
              const SizedBox(height: 16),
              const Text(
                'No travel insurance added yet',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Add your policy details to keep them handy while traveling.',
                textAlign: TextAlign.center,
                style: TextStyle(color: AppColors.textTertiary, fontSize: 13),
              ),
              const SizedBox(height: 24),
              FilledButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.add),
                label: const Text('Add Insurance Policy'),
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.primary,
                ),
              ),
            ],
          ),
        ),
      );
    }

    final daysLeft = policy.coverageEnd.difference(DateTime.now()).inDays;
    final isExpiringSoon = daysLeft <= 30 && daysLeft > 0;
    final isExpired = daysLeft <= 0;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Policy Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppColors.primary, AppColors.primaryLight],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withValues(alpha: 0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.shield, color: AppColors.white, size: 24),
                        SizedBox(width: 8),
                        Text(
                          'Travel Insurance',
                          style: TextStyle(
                            color: AppColors.white,
                            fontWeight: FontWeight.w700,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    Container(
                      padding:
                          const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: isExpired
                            ? AppColors.error
                            : isExpiringSoon
                                ? AppColors.warning
                                : AppColors.success,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        isExpired
                            ? 'EXPIRED'
                            : isExpiringSoon
                                ? '$daysLeft DAYS LEFT'
                                : 'ACTIVE',
                        style: const TextStyle(
                          color: AppColors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                _PolicyDetail(label: 'Policy Number', value: policy.policyNumber),
                const SizedBox(height: 10),
                _PolicyDetail(label: 'Insurer', value: policy.insurer),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: _PolicyDetail(
                        label: 'From',
                        value:
                            '${policy.coverageStart.day}/${policy.coverageStart.month}/${policy.coverageStart.year}',
                      ),
                    ),
                    Expanded(
                      child: _PolicyDetail(
                        label: 'To',
                        value:
                            '${policy.coverageEnd.day}/${policy.coverageEnd.month}/${policy.coverageEnd.year}',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Emergency Helpline
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.error.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: AppColors.error.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.phone_in_talk,
                      color: AppColors.error, size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Emergency Helpline',
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 13,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      Text(
                        policy.emergencyHelpline,
                        style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 18,
                          color: AppColors.error,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  decoration: BoxDecoration(
                    color: AppColors.error,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.phone, color: AppColors.white, size: 20),
                    onPressed: () {},
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Coverage Type Checklist
          Text(
            'Coverage Details',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          Card(
            margin: EdgeInsets.zero,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: policy.coverageTypes.entries.map((entry) {
                return _CoverageRow(
                  label: entry.key,
                  covered: entry.value,
                  isLast:
                      entry.key == policy.coverageTypes.keys.last,
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 24),

          // Quick Tips
          Container(
            padding: const EdgeInsets.all(16),
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
                    Icon(Icons.lightbulb_outline, color: AppColors.info, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Insurance Tips',
                      style: TextStyle(fontWeight: FontWeight.w700),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '- Keep a photo/screenshot of your policy on your phone\n'
                  '- Save the helpline number in your phone contacts\n'
                  '- Know your policy excess/deductible amount\n'
                  '- Report claims within 24 hours when possible\n'
                  '- Keep all medical receipts and police reports',
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

// ===========================================================================
// TAB 3 - Pharmacy
// ===========================================================================

class _PharmacyTab extends ConsumerWidget {
  const _PharmacyTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final only24hr = ref.watch(_pharmacyFilterProvider);
    final drugQuery = ref.watch(_drugSearchProvider);

    final filteredPharmacies = only24hr
        ? _pharmacies.where((p) => p['is24hr'] == true).toList()
        : _pharmacies;

    final drugResults = drugQuery.isNotEmpty
        ? _drugTranslations.entries
            .where((e) =>
                e.key.contains(drugQuery.toLowerCase()) ||
                e.value['generic']!.toLowerCase().contains(drugQuery.toLowerCase()))
            .toList()
        : <MapEntry<String, Map<String, String>>>[];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ---- Generic Drug Name Translator ----
          Text(
            'Drug Name Translator',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 4),
          Text(
            'Enter a brand name to find the generic equivalent',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
          ),
          const SizedBox(height: 12),
          TextField(
            onChanged: (v) =>
                ref.read(_drugSearchProvider.notifier).state = v,
            decoration: InputDecoration(
              hintText: 'e.g. Tylenol, Advil, Imodium...',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              filled: true,
              fillColor: AppColors.surfaceVariant,
            ),
          ),
          if (drugQuery.isNotEmpty) ...[
            const SizedBox(height: 12),
            if (drugResults.isEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.warning.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline,
                        color: AppColors.warning, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'No matches found for "$drugQuery". Try another brand name.',
                        style: const TextStyle(
                            fontSize: 13, color: AppColors.textSecondary),
                      ),
                    ),
                  ],
                ),
              )
            else
              ...drugResults.map((entry) => Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(14),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color:
                                  AppColors.badgeCulture.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(Icons.medication,
                                color: AppColors.badgeCulture, size: 22),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      entry.key[0].toUpperCase() +
                                          entry.key.substring(1),
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w600,
                                        color: AppColors.textSecondary,
                                        decoration: TextDecoration.lineThrough,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    const Icon(Icons.arrow_forward,
                                        size: 16, color: AppColors.accent),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  entry.value['generic']!,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w700,
                                    fontSize: 15,
                                    color: AppColors.primary,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  entry.value['use']!,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: AppColors.textTertiary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  )),
          ],
          const SizedBox(height: 28),

          // ---- Nearby Pharmacies ----
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Nearby Pharmacies',
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(fontWeight: FontWeight.w700),
              ),
              FilterChip(
                selected: only24hr,
                onSelected: (v) =>
                    ref.read(_pharmacyFilterProvider.notifier).state = v,
                label: const Text('24-hour only'),
                avatar: Icon(
                  Icons.access_time_filled,
                  size: 16,
                  color: only24hr ? AppColors.primary : AppColors.textTertiary,
                ),
                selectedColor: AppColors.primary.withValues(alpha: 0.12),
                labelStyle: TextStyle(
                  fontSize: 12,
                  color: only24hr ? AppColors.primary : AppColors.textSecondary,
                  fontWeight: only24hr ? FontWeight.w600 : FontWeight.w400,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...filteredPharmacies.map((p) => _PharmacyCard(pharmacy: p)),
          const SizedBox(height: 24),

          // Medical Supply Checklist
          Text(
            'Travel Medical Supplies',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.success.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.success.withValues(alpha: 0.2)),
            ),
            child: Column(
              children: [
                _SupplyCheckItem(label: 'Prescription medications (extra supply)'),
                _SupplyCheckItem(label: 'Pain reliever (Ibuprofen / Paracetamol)'),
                _SupplyCheckItem(label: 'Anti-diarrheal (Loperamide)'),
                _SupplyCheckItem(label: 'Antihistamine (Cetirizine)'),
                _SupplyCheckItem(label: 'Oral Rehydration Salts (ORS)'),
                _SupplyCheckItem(label: 'Adhesive bandages & antiseptic wipes'),
                _SupplyCheckItem(label: 'Sunscreen SPF 50+'),
                _SupplyCheckItem(label: 'Insect repellent (DEET-based)'),
                _SupplyCheckItem(label: 'Hand sanitizer'),
                _SupplyCheckItem(label: 'Thermometer'),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

// ===========================================================================
// TAB 4 - First Aid
// ===========================================================================

class _FirstAidTab extends StatelessWidget {
  const _FirstAidTab();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.error.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
            ),
            child: const Row(
              children: [
                Icon(Icons.warning_amber_rounded,
                    color: AppColors.error, size: 22),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'This guide is for informational purposes only. Always seek professional medical help for serious conditions.',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.error,
                      fontWeight: FontWeight.w500,
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          ..._firstAidGuides.map((guide) => _FirstAidCard(guide: guide)),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

// ===========================================================================
// Shared Widgets
// ===========================================================================

class _SectionLabel extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;

  const _SectionLabel({
    required this.icon,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 18, color: color),
        const SizedBox(width: 6),
        Text(
          label,
          style: TextStyle(
            fontWeight: FontWeight.w700,
            color: color,
            fontSize: 14,
          ),
        ),
      ],
    );
  }
}

class _EmptyState extends StatelessWidget {
  final IconData icon;
  final String message;

  const _EmptyState({required this.icon, required this.message});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 24),
        child: Column(
          children: [
            Icon(icon, size: 48, color: AppColors.textTertiary),
            const SizedBox(height: 12),
            Text(
              message,
              textAlign: TextAlign.center,
              style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
            ),
          ],
        ),
      ),
    );
  }
}

class _VaccineRequirementTile extends StatelessWidget {
  final String name;
  final String note;
  final bool isRequired;

  const _VaccineRequirementTile({
    required this.name,
    required this.note,
    required this.isRequired,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: ListTile(
        dense: true,
        leading: Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: (isRequired ? AppColors.error : AppColors.info)
                .withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            isRequired ? Icons.shield : Icons.recommend,
            color: isRequired ? AppColors.error : AppColors.info,
            size: 20,
          ),
        ),
        title: Text(name, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle:
            Text(note, style: const TextStyle(fontSize: 12)),
        trailing: Icon(
          isRequired ? Icons.error : Icons.info_outline,
          color: isRequired ? AppColors.error : AppColors.info,
          size: 18,
        ),
      ),
    );
  }
}

class _VaccinationRecordCard extends ConsumerWidget {
  final VaccinationRecord record;

  const _VaccinationRecordCard({required this.record});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isBoosterDue = record.nextBoosterDue != null &&
        record.nextBoosterDue!.isBefore(DateTime.now());

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
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
                    color: AppColors.success.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.vaccines,
                      color: AppColors.success, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        record.name,
                        style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 15,
                        ),
                      ),
                      Text(
                        record.brand,
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.delete_outline,
                      color: AppColors.error, size: 20),
                  onPressed: () =>
                      ref.read(_vaccinationRecordsProvider.notifier).remove(record.id),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                _InfoChip(
                  icon: Icons.calendar_today,
                  label:
                      '${record.dateAdministered.day}/${record.dateAdministered.month}/${record.dateAdministered.year}',
                  color: AppColors.primary,
                ),
                const SizedBox(width: 8),
                if (record.nextBoosterDue != null)
                  _InfoChip(
                    icon: Icons.event_repeat,
                    label:
                        'Booster: ${record.nextBoosterDue!.day}/${record.nextBoosterDue!.month}/${record.nextBoosterDue!.year}',
                    color: isBoosterDue ? AppColors.error : AppColors.warning,
                  ),
              ],
            ),
            if (isBoosterDue) ...[
              const SizedBox(height: 8),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.error.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.warning_amber, color: AppColors.error, size: 14),
                    SizedBox(width: 4),
                    Text(
                      'Booster overdue!',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: AppColors.error,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;

  const _InfoChip({
    required this.icon,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: color),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              color: color,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _DigitalVaccinationCard extends StatelessWidget {
  final List<VaccinationRecord> records;

  const _DigitalVaccinationCard({required this.records});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primary, AppColors.primaryDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.25),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
            child: Row(
              children: [
                const Icon(Icons.verified_user, color: AppColors.white, size: 28),
                const SizedBox(width: 10),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'International Vaccination Certificate',
                      style: TextStyle(
                        color: AppColors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                      ),
                    ),
                    Text(
                      '${records.length} vaccine${records.length == 1 ? '' : 's'} on record',
                      style: TextStyle(
                        color: AppColors.white.withValues(alpha: 0.7),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Container(
            width: double.infinity,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              children: records.isEmpty
                  ? [
                      Text(
                        'Add vaccination records to generate your digital card',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: AppColors.white.withValues(alpha: 0.7),
                          fontSize: 12,
                        ),
                      ),
                    ]
                  : records
                      .map(
                        (r) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 3),
                          child: Row(
                            children: [
                              const Icon(Icons.check_circle,
                                  color: AppColors.success, size: 16),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  r.name,
                                  style: const TextStyle(
                                    color: AppColors.white,
                                    fontSize: 13,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                              Text(
                                '${r.dateAdministered.day}/${r.dateAdministered.month}/${r.dateAdministered.year}',
                                style: TextStyle(
                                  color: AppColors.white.withValues(alpha: 0.7),
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ),
                      )
                      .toList(),
            ),
          ),
          const SizedBox(height: 16),
          // QR Code Concept
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.qr_code_2, size: 56, color: AppColors.primary),
                const SizedBox(height: 2),
                Text(
                  'Scan to verify',
                  style: TextStyle(
                    fontSize: 9,
                    color: AppColors.textSecondary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Show this QR code at immigration checkpoints',
            style: TextStyle(
              color: AppColors.white.withValues(alpha: 0.6),
              fontSize: 11,
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _MedicationReminderTile extends ConsumerWidget {
  final MedicationReminder reminder;

  const _MedicationReminderTile({required this.reminder});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: (reminder.isActive ? AppColors.accent : AppColors.disabled)
                .withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            Icons.alarm,
            color: reminder.isActive ? AppColors.accent : AppColors.disabled,
            size: 22,
          ),
        ),
        title: Text(
          reminder.medicineName,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            decoration:
                reminder.isActive ? null : TextDecoration.lineThrough,
          ),
        ),
        subtitle: Text(
          '${reminder.dosage} at ${reminder.time.format(context)}',
          style: const TextStyle(fontSize: 12),
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Switch(
              value: reminder.isActive,
              onChanged: (_) => ref
                  .read(_medicationRemindersProvider.notifier)
                  .toggle(reminder.id),
              activeColor: AppColors.accent,
            ),
            IconButton(
              icon: const Icon(Icons.delete_outline, size: 20),
              color: AppColors.error,
              onPressed: () => ref
                  .read(_medicationRemindersProvider.notifier)
                  .remove(reminder.id),
            ),
          ],
        ),
      ),
    );
  }
}

class _PolicyDetail extends StatelessWidget {
  final String label;
  final String value;

  const _PolicyDetail({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            color: AppColors.white.withValues(alpha: 0.6),
            fontSize: 11,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: const TextStyle(
            color: AppColors.white,
            fontWeight: FontWeight.w700,
            fontSize: 15,
          ),
        ),
      ],
    );
  }
}

class _CoverageRow extends StatelessWidget {
  final String label;
  final bool covered;
  final bool isLast;

  const _CoverageRow({
    required this.label,
    required this.covered,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        border: isLast
            ? null
            : const Border(
                bottom: BorderSide(color: AppColors.divider, width: 0.5),
              ),
      ),
      child: Row(
        children: [
          Icon(
            covered ? Icons.check_circle : Icons.cancel,
            color: covered ? AppColors.success : AppColors.error,
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                fontWeight: FontWeight.w500,
                color: covered ? AppColors.textPrimary : AppColors.textTertiary,
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: (covered ? AppColors.success : AppColors.error)
                  .withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              covered ? 'Covered' : 'Not Covered',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: covered ? AppColors.success : AppColors.error,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PharmacyCard extends StatelessWidget {
  final Map<String, dynamic> pharmacy;

  const _PharmacyCard({required this.pharmacy});

  @override
  Widget build(BuildContext context) {
    final isOpen = pharmacy['open'] as bool;
    final is24hr = pharmacy['is24hr'] as bool;

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: AppColors.success.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.local_pharmacy,
                  color: AppColors.success, size: 24),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          pharmacy['name'] as String,
                          style: const TextStyle(fontWeight: FontWeight.w600),
                        ),
                      ),
                      if (is24hr)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.info.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            '24 HR',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: AppColors.info,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    pharmacy['address'] as String,
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.location_on,
                          size: 14, color: AppColors.accent),
                      const SizedBox(width: 2),
                      Text(
                        pharmacy['distance'] as String,
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(width: 12),
                      const Icon(Icons.star,
                          size: 14, color: AppColors.warning),
                      const SizedBox(width: 2),
                      Text(
                        pharmacy['rating'] as String,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: (isOpen ? AppColors.success : AppColors.error)
                              .withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          isOpen ? 'Open' : 'Closed',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: isOpen ? AppColors.success : AppColors.error,
                          ),
                        ),
                      ),
                    ],
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

class _SupplyCheckItem extends StatefulWidget {
  final String label;

  const _SupplyCheckItem({required this.label});

  @override
  State<_SupplyCheckItem> createState() => _SupplyCheckItemState();
}

class _SupplyCheckItemState extends State<_SupplyCheckItem> {
  bool _checked = false;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => setState(() => _checked = !_checked),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          children: [
            Icon(
              _checked ? Icons.check_box : Icons.check_box_outline_blank,
              color: _checked ? AppColors.success : AppColors.textTertiary,
              size: 22,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                widget.label,
                style: TextStyle(
                  fontSize: 13,
                  color:
                      _checked ? AppColors.textSecondary : AppColors.textPrimary,
                  decoration: _checked ? TextDecoration.lineThrough : null,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FirstAidCard extends StatefulWidget {
  final Map<String, dynamic> guide;

  const _FirstAidCard({required this.guide});

  @override
  State<_FirstAidCard> createState() => _FirstAidCardState();
}

class _FirstAidCardState extends State<_FirstAidCard> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    final guide = widget.guide;
    final color = Color(guide['color'] as int);
    final symptoms = guide['symptoms'] as List<String>;
    final steps = guide['steps'] as List<String>;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          InkWell(
            onTap: () => setState(() => _expanded = !_expanded),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(guide['icon'] as IconData,
                        color: color, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Text(
                      guide['title'] as String,
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 16,
                      ),
                    ),
                  ),
                  AnimatedRotation(
                    turns: _expanded ? 0.5 : 0,
                    duration: const Duration(milliseconds: 200),
                    child: Icon(
                      Icons.keyboard_arrow_down,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ),
          AnimatedCrossFade(
            firstChild: const SizedBox.shrink(),
            secondChild: Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Symptoms
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.06),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.monitor_heart, size: 16, color: color),
                            const SizedBox(width: 6),
                            Text(
                              'Symptoms',
                              style: TextStyle(
                                fontWeight: FontWeight.w700,
                                fontSize: 13,
                                color: color,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        ...symptoms.map((s) => Padding(
                              padding: const EdgeInsets.only(bottom: 3),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('  ',
                                      style: TextStyle(
                                          color: color, fontSize: 12)),
                                  const SizedBox(width: 6),
                                  Expanded(
                                    child: Text(s,
                                        style: const TextStyle(
                                            fontSize: 12, height: 1.3)),
                                  ),
                                ],
                              ),
                            )),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Steps
                  const Row(
                    children: [
                      Icon(Icons.medical_information,
                          size: 16, color: AppColors.primary),
                      SizedBox(width: 6),
                      Text(
                        'What To Do',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 13,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ...steps.asMap().entries.map((entry) => Padding(
                        padding: const EdgeInsets.only(bottom: 6),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 22,
                              height: 22,
                              decoration: BoxDecoration(
                                color: AppColors.primary.withValues(alpha: 0.1),
                                shape: BoxShape.circle,
                              ),
                              child: Center(
                                child: Text(
                                  '${entry.key + 1}',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.primary,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                entry.value,
                                style: const TextStyle(
                                    fontSize: 13, height: 1.4),
                              ),
                            ),
                          ],
                        ),
                      )),
                ],
              ),
            ),
            crossFadeState: _expanded
                ? CrossFadeState.showSecond
                : CrossFadeState.showFirst,
            duration: const Duration(milliseconds: 250),
          ),
        ],
      ),
    );
  }
}
