import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

final selectedCategoryProvider = StateProvider<String>((ref) => 'All');
final savedEventIdsProvider = StateProvider<Set<String>>((ref) => {});
final itineraryEventIdsProvider = StateProvider<Set<String>>((ref) => {});
final selectedFestivalMonthProvider = StateProvider<int>((ref) => DateTime.now().month);

// ---------------------------------------------------------------------------
// Data models
// ---------------------------------------------------------------------------

class _Event {
  final String id;
  final String title;
  final String description;
  final String location;
  final String date;
  final String type; // Festivals, Concerts, Sports, Cultural, Experiences
  final IconData icon;
  final Color badgeColor;

  const _Event({
    required this.id,
    required this.title,
    required this.description,
    required this.location,
    required this.date,
    required this.type,
    required this.icon,
    required this.badgeColor,
  });
}

class _Experience {
  final String id;
  final String title;
  final String description;
  final String location;
  final double rating;
  final int reviews;
  final String duration;
  final String price;
  final IconData icon;
  final Color color;

  const _Experience({
    required this.id,
    required this.title,
    required this.description,
    required this.location,
    required this.rating,
    required this.reviews,
    required this.duration,
    required this.price,
    required this.icon,
    required this.color,
  });
}

class _Festival {
  final String name;
  final String country;
  final String significance;
  final int month;
  final IconData icon;
  final Color color;

  const _Festival({
    required this.name,
    required this.country,
    required this.significance,
    required this.month,
    required this.icon,
    required this.color,
  });
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const _categories = ['All', 'Festivals', 'Concerts', 'Sports', 'Cultural', 'Experiences'];

const _events = <_Event>[
  _Event(
    id: 'e1',
    title: 'Holi Festival of Colors',
    description: 'Join the vibrant celebration of spring with colors, music, and dance across the city.',
    location: 'Jaipur, India',
    date: 'Mar 14, 2026',
    type: 'Festivals',
    icon: Icons.celebration,
    badgeColor: Color(0xFF8B5CF6),
  ),
  _Event(
    id: 'e2',
    title: 'Sakura Jazz Night',
    description: 'Live jazz under the cherry blossoms in Ueno Park. Featuring top local and international artists.',
    location: 'Tokyo, Japan',
    date: 'Apr 2, 2026',
    type: 'Concerts',
    icon: Icons.music_note,
    badgeColor: Color(0xFFEC4899),
  ),
  _Event(
    id: 'e3',
    title: 'Muay Thai Championship',
    description: 'Experience the national sport of Thailand at the legendary Rajadamnern Stadium.',
    location: 'Bangkok, Thailand',
    date: 'Mar 22, 2026',
    type: 'Sports',
    icon: Icons.sports_mma,
    badgeColor: Color(0xFF14B8A6),
  ),
  _Event(
    id: 'e4',
    title: 'Flamenco Under the Stars',
    description: 'An evening of passionate flamenco dance and guitar in a historic courtyard.',
    location: 'Seville, Spain',
    date: 'Apr 10, 2026',
    type: 'Cultural',
    icon: Icons.theater_comedy,
    badgeColor: Color(0xFFF97316),
  ),
  _Event(
    id: 'e5',
    title: 'Lantern Festival',
    description: 'Thousands of lanterns light up the night sky to mark the end of Lunar New Year celebrations.',
    location: 'Chiang Mai, Thailand',
    date: 'Mar 18, 2026',
    type: 'Festivals',
    icon: Icons.light_mode,
    badgeColor: Color(0xFF8B5CF6),
  ),
  _Event(
    id: 'e6',
    title: 'La Tomatina',
    description: 'The world-famous tomato-throwing festival. A once-in-a-lifetime messy experience!',
    location: 'Bunol, Spain',
    date: 'Aug 26, 2026',
    type: 'Festivals',
    icon: Icons.fastfood,
    badgeColor: Color(0xFF8B5CF6),
  ),
  _Event(
    id: 'e7',
    title: 'Sumida River Fireworks',
    description: 'One of Japan\'s oldest and largest fireworks festivals lighting up Tokyo\'s sky.',
    location: 'Tokyo, Japan',
    date: 'Jul 25, 2026',
    type: 'Cultural',
    icon: Icons.fireplace,
    badgeColor: Color(0xFFF97316),
  ),
  _Event(
    id: 'e8',
    title: 'Six Nations Rugby Final',
    description: 'Catch the thrilling climax of Europe\'s premier rugby championship.',
    location: 'Paris, France',
    date: 'Mar 15, 2026',
    type: 'Sports',
    icon: Icons.sports_rugby,
    badgeColor: Color(0xFF14B8A6),
  ),
];

const _experiences = <_Experience>[
  _Experience(
    id: 'x1',
    title: 'Thai Cooking Class',
    description: 'Learn to cook authentic Pad Thai, Green Curry, and Mango Sticky Rice with a local chef.',
    location: 'Bangkok, Thailand',
    rating: 4.9,
    reviews: 342,
    duration: '3 hours',
    price: '\$45',
    icon: Icons.soup_kitchen,
    color: Color(0xFFF97316),
  ),
  _Experience(
    id: 'x2',
    title: 'Himalayan Guided Trek',
    description: 'A sunrise trek through rhododendron forests with panoramic mountain views.',
    location: 'Pokhara, Nepal',
    rating: 4.8,
    reviews: 189,
    duration: '6 hours',
    price: '\$65',
    icon: Icons.terrain,
    color: Color(0xFF14B8A6),
  ),
  _Experience(
    id: 'x3',
    title: 'Pottery Workshop',
    description: 'Hand-craft traditional Japanese ceramics with a master potter in a 100-year-old studio.',
    location: 'Kyoto, Japan',
    rating: 4.7,
    reviews: 127,
    duration: '2.5 hours',
    price: '\$55',
    icon: Icons.palette,
    color: Color(0xFF8B5CF6),
  ),
  _Experience(
    id: 'x4',
    title: 'Vineyard Tour & Tasting',
    description: 'Explore the rolling vineyards of Tuscany and taste award-winning wines.',
    location: 'Florence, Italy',
    rating: 4.9,
    reviews: 256,
    duration: '4 hours',
    price: '\$80',
    icon: Icons.wine_bar,
    color: Color(0xFFEC4899),
  ),
  _Experience(
    id: 'x5',
    title: 'Batik Fabric Dyeing',
    description: 'Create your own batik masterpiece using traditional wax-resist techniques.',
    location: 'Yogyakarta, Indonesia',
    rating: 4.6,
    reviews: 98,
    duration: '2 hours',
    price: '\$30',
    icon: Icons.color_lens,
    color: Color(0xFF6366F1),
  ),
  _Experience(
    id: 'x6',
    title: 'Medina Walking Tour',
    description: 'Navigate the ancient souks with a local storyteller revealing hidden gems.',
    location: 'Marrakech, Morocco',
    rating: 4.8,
    reviews: 214,
    duration: '3 hours',
    price: '\$35',
    icon: Icons.directions_walk,
    color: Color(0xFFF59E0B),
  ),
];

const _festivals = <_Festival>[
  _Festival(name: 'Carnival', country: 'Brazil', significance: 'Samba parades and street celebrations before Lent', month: 2, icon: Icons.celebration, color: Color(0xFFEC4899)),
  _Festival(name: 'Holi', country: 'India', significance: 'Festival of colors celebrating the arrival of spring', month: 3, icon: Icons.color_lens, color: Color(0xFF8B5CF6)),
  _Festival(name: 'Songkran', country: 'Thailand', significance: 'Thai New Year water festival symbolizing purification', month: 4, icon: Icons.water_drop, color: Color(0xFF3B82F6)),
  _Festival(name: 'Hanami', country: 'Japan', significance: 'Cherry blossom viewing tradition celebrating renewal', month: 4, icon: Icons.local_florist, color: Color(0xFFEC4899)),
  _Festival(name: 'Inti Raymi', country: 'Peru', significance: 'Ancient Incan sun festival at the winter solstice', month: 6, icon: Icons.wb_sunny, color: Color(0xFFF59E0B)),
  _Festival(name: 'Bastille Day', country: 'France', significance: 'National celebration of French Republic with fireworks', month: 7, icon: Icons.flag, color: Color(0xFF3B82F6)),
  _Festival(name: 'Obon', country: 'Japan', significance: 'Buddhist festival honoring ancestral spirits', month: 8, icon: Icons.light_mode, color: Color(0xFF8B5CF6)),
  _Festival(name: 'La Tomatina', country: 'Spain', significance: 'World-famous tomato throwing festival in Bunol', month: 8, icon: Icons.fastfood, color: Color(0xFFEF4444)),
  _Festival(name: 'Oktoberfest', country: 'Germany', significance: 'World\'s largest beer festival and folk celebration', month: 9, icon: Icons.sports_bar, color: Color(0xFFF97316)),
  _Festival(name: 'Mid-Autumn', country: 'China', significance: 'Lantern-lit harvest moon celebration with mooncakes', month: 9, icon: Icons.nightlight, color: Color(0xFFF59E0B)),
  _Festival(name: 'Diwali', country: 'India', significance: 'Festival of lights symbolizing victory of light over darkness', month: 10, icon: Icons.lightbulb, color: Color(0xFFF97316)),
  _Festival(name: 'Day of the Dead', country: 'Mexico', significance: 'Honoring departed loved ones with altars and marigolds', month: 11, icon: Icons.local_florist, color: Color(0xFF8B5CF6)),
];

const _monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// ---------------------------------------------------------------------------
// Sunset / golden hour data
// ---------------------------------------------------------------------------

class _SunData {
  final String city;
  final String sunrise;
  final String sunset;
  final String goldenHourStart;
  final String goldenHourEnd;

  const _SunData({
    required this.city,
    required this.sunrise,
    required this.sunset,
    required this.goldenHourStart,
    required this.goldenHourEnd,
  });
}

const _sunDataEntries = <_SunData>[
  _SunData(city: 'Santorini, Greece', sunrise: '06:42', sunset: '18:28', goldenHourStart: '17:48', goldenHourEnd: '18:28'),
  _SunData(city: 'Bali, Indonesia', sunrise: '06:15', sunset: '18:22', goldenHourStart: '17:42', goldenHourEnd: '18:22'),
  _SunData(city: 'Jaipur, India', sunrise: '06:34', sunset: '18:31', goldenHourStart: '17:51', goldenHourEnd: '18:31'),
  _SunData(city: 'Kyoto, Japan', sunrise: '06:02', sunset: '18:10', goldenHourStart: '17:30', goldenHourEnd: '18:10'),
];

// ---------------------------------------------------------------------------
// Events Screen
// ---------------------------------------------------------------------------

class EventsScreen extends ConsumerStatefulWidget {
  const EventsScreen({super.key});

  @override
  ConsumerState<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends ConsumerState<EventsScreen>
    with SingleTickerProviderStateMixin {
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
        title: const Text('Events & Experiences'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          labelColor: AppColors.accent,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.accent,
          indicatorWeight: 3,
          tabAlignment: TabAlignment.start,
          tabs: const [
            Tab(text: 'Events Near Me'),
            Tab(text: 'Experiences'),
            Tab(text: 'Festival Calendar'),
            Tab(text: 'Golden Hour'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: const [
          _EventsNearMeTab(),
          _LocalExperiencesTab(),
          _FestivalCalendarTab(),
          _SunsetTrackerTab(),
        ],
      ),
    );
  }
}

// ===========================================================================
// TAB 1 -- Events Near Me
// ===========================================================================

class _EventsNearMeTab extends ConsumerWidget {
  const _EventsNearMeTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedCategory = ref.watch(selectedCategoryProvider);
    final savedIds = ref.watch(savedEventIdsProvider);
    final itineraryIds = ref.watch(itineraryEventIdsProvider);

    final filtered = selectedCategory == 'All'
        ? _events
        : _events.where((e) => e.type == selectedCategory).toList();

    return Column(
      children: [
        const SizedBox(height: 12),
        // Category filter chips
        SizedBox(
          height: 40,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: _categories.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              final cat = _categories[index];
              final isSelected = selectedCategory == cat;
              return ChoiceChip(
                selected: isSelected,
                onSelected: (_) =>
                    ref.read(selectedCategoryProvider.notifier).state = cat,
                label: Text(cat),
                selectedColor: AppColors.accent.withValues(alpha: 0.15),
                labelStyle: TextStyle(
                  color: isSelected ? AppColors.accent : AppColors.textSecondary,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 8),
        Expanded(
          child: filtered.isEmpty
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.event_busy, size: 64, color: AppColors.textTertiary),
                      const SizedBox(height: 12),
                      Text(
                        'No events found for "$selectedCategory"',
                        style: TextStyle(color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final event = filtered[index];
                    final isSaved = savedIds.contains(event.id);
                    final inItinerary = itineraryIds.contains(event.id);

                    return _EventCard(
                      event: event,
                      isSaved: isSaved,
                      inItinerary: inItinerary,
                      onToggleSave: () {
                        final current = ref.read(savedEventIdsProvider);
                        if (current.contains(event.id)) {
                          ref.read(savedEventIdsProvider.notifier).state =
                              {...current}..remove(event.id);
                        } else {
                          ref.read(savedEventIdsProvider.notifier).state =
                              {...current, event.id};
                        }
                      },
                      onAddToItinerary: () {
                        final current = ref.read(itineraryEventIdsProvider);
                        if (!current.contains(event.id)) {
                          ref.read(itineraryEventIdsProvider.notifier).state =
                              {...current, event.id};
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('${event.title} added to itinerary'),
                              behavior: SnackBarBehavior.floating,
                              backgroundColor: AppColors.success,
                              duration: const Duration(seconds: 2),
                            ),
                          );
                        }
                      },
                    );
                  },
                ),
        ),
      ],
    );
  }
}

class _EventCard extends StatelessWidget {
  final _Event event;
  final bool isSaved;
  final bool inItinerary;
  final VoidCallback onToggleSave;
  final VoidCallback onAddToItinerary;

  const _EventCard({
    required this.event,
    required this.isSaved,
    required this.inItinerary,
    required this.onToggleSave,
    required this.onAddToItinerary,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      elevation: 0,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.border),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top row: type badge + bookmark
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: event.badgeColor.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(event.icon, size: 14, color: event.badgeColor),
                        const SizedBox(width: 4),
                        Text(
                          event.type,
                          style: TextStyle(
                            color: event.badgeColor,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Spacer(),
                  InkWell(
                    borderRadius: BorderRadius.circular(20),
                    onTap: onToggleSave,
                    child: Padding(
                      padding: const EdgeInsets.all(4),
                      child: Icon(
                        isSaved ? Icons.bookmark : Icons.bookmark_border,
                        color: isSaved ? AppColors.accent : AppColors.textTertiary,
                        size: 22,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // Title
              Text(
                event.title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 6),

              // Description
              Text(
                event.description,
                style: const TextStyle(
                  fontSize: 13,
                  color: AppColors.textSecondary,
                  height: 1.4,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),

              // Date & Location row
              Row(
                children: [
                  const Icon(Icons.calendar_today, size: 14, color: AppColors.accent),
                  const SizedBox(width: 4),
                  Text(
                    event.date,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textSecondary),
                  ),
                  const SizedBox(width: 16),
                  const Icon(Icons.location_on_outlined, size: 14, color: AppColors.accent),
                  const SizedBox(width: 4),
                  Flexible(
                    child: Text(
                      event.location,
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textSecondary),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Add to itinerary button
              SizedBox(
                width: double.infinity,
                child: inItinerary
                    ? OutlinedButton.icon(
                        onPressed: null,
                        icon: const Icon(Icons.check, size: 18),
                        label: const Text('Added to Itinerary'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.success,
                          side: const BorderSide(color: AppColors.success),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      )
                    : FilledButton.icon(
                        onPressed: onAddToItinerary,
                        icon: const Icon(Icons.add, size: 18),
                        label: const Text('Add to Itinerary'),
                        style: FilledButton.styleFrom(
                          backgroundColor: AppColors.accent,
                          foregroundColor: AppColors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ===========================================================================
// TAB 2 -- Local Experiences
// ===========================================================================

class _LocalExperiencesTab extends ConsumerWidget {
  const _LocalExperiencesTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final savedIds = ref.watch(savedEventIdsProvider);

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _experiences.length,
      itemBuilder: (context, index) {
        final exp = _experiences[index];
        final isSaved = savedIds.contains(exp.id);

        return _ExperienceCard(
          experience: exp,
          isSaved: isSaved,
          onToggleSave: () {
            final current = ref.read(savedEventIdsProvider);
            if (current.contains(exp.id)) {
              ref.read(savedEventIdsProvider.notifier).state =
                  {...current}..remove(exp.id);
            } else {
              ref.read(savedEventIdsProvider.notifier).state =
                  {...current, exp.id};
            }
          },
          onAddToItinerary: () {
            final current = ref.read(itineraryEventIdsProvider);
            if (!current.contains(exp.id)) {
              ref.read(itineraryEventIdsProvider.notifier).state =
                  {...current, exp.id};
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('${exp.title} added to itinerary'),
                  behavior: SnackBarBehavior.floating,
                  backgroundColor: AppColors.success,
                  duration: const Duration(seconds: 2),
                ),
              );
            }
          },
        );
      },
    );
  }
}

class _ExperienceCard extends StatelessWidget {
  final _Experience experience;
  final bool isSaved;
  final VoidCallback onToggleSave;
  final VoidCallback onAddToItinerary;

  const _ExperienceCard({
    required this.experience,
    required this.isSaved,
    required this.onToggleSave,
    required this.onAddToItinerary,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      elevation: 0,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.border),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Icon
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: experience.color.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(experience.icon, color: experience.color, size: 26),
                  ),
                  const SizedBox(width: 12),
                  // Title, location, rating
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          experience.title,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.location_on_outlined, size: 13, color: AppColors.textTertiary),
                            const SizedBox(width: 2),
                            Flexible(
                              child: Text(
                                experience.location,
                                style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  // Bookmark
                  InkWell(
                    borderRadius: BorderRadius.circular(20),
                    onTap: onToggleSave,
                    child: Padding(
                      padding: const EdgeInsets.all(4),
                      child: Icon(
                        isSaved ? Icons.bookmark : Icons.bookmark_border,
                        color: isSaved ? AppColors.accent : AppColors.textTertiary,
                        size: 22,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // Description
              Text(
                experience.description,
                style: const TextStyle(fontSize: 13, color: AppColors.textSecondary, height: 1.4),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),

              // Rating + duration + price row
              Row(
                children: [
                  // Stars
                  const Icon(Icons.star, size: 16, color: Color(0xFFFBBF24)),
                  const SizedBox(width: 3),
                  Text(
                    experience.rating.toString(),
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                  ),
                  const SizedBox(width: 2),
                  Text(
                    '(${experience.reviews})',
                    style: const TextStyle(fontSize: 12, color: AppColors.textTertiary),
                  ),
                  const SizedBox(width: 16),
                  const Icon(Icons.schedule, size: 14, color: AppColors.textTertiary),
                  const SizedBox(width: 3),
                  Text(
                    experience.duration,
                    style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      experience.price,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Add to Itinerary
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: onAddToItinerary,
                  icon: const Icon(Icons.add, size: 18),
                  label: const Text('Add to Itinerary'),
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.accent,
                    foregroundColor: AppColors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ===========================================================================
// TAB 3 -- Festival Calendar
// ===========================================================================

class _FestivalCalendarTab extends ConsumerWidget {
  const _FestivalCalendarTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedMonth = ref.watch(selectedFestivalMonthProvider);
    final festivalsInMonth =
        _festivals.where((f) => f.month == selectedMonth).toList();

    return Column(
      children: [
        const SizedBox(height: 16),
        // Month selector
        SizedBox(
          height: 40,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: 12,
            separatorBuilder: (_, __) => const SizedBox(width: 6),
            itemBuilder: (context, index) {
              final month = index + 1;
              final isSelected = selectedMonth == month;
              final hasFestivals = _festivals.any((f) => f.month == month);
              return ChoiceChip(
                selected: isSelected,
                onSelected: (_) =>
                    ref.read(selectedFestivalMonthProvider.notifier).state = month,
                label: Text(_monthNames[index]),
                selectedColor: AppColors.accent.withValues(alpha: 0.15),
                labelStyle: TextStyle(
                  color: isSelected
                      ? AppColors.accent
                      : hasFestivals
                          ? AppColors.textPrimary
                          : AppColors.textTertiary,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                  fontSize: 13,
                ),
                avatar: hasFestivals && !isSelected
                    ? Container(
                        width: 6,
                        height: 6,
                        decoration: const BoxDecoration(
                          color: AppColors.accent,
                          shape: BoxShape.circle,
                        ),
                      )
                    : null,
              );
            },
          ),
        ),
        const SizedBox(height: 16),

        // Header
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              Icon(Icons.festival, color: AppColors.accent, size: 20),
              const SizedBox(width: 8),
              Text(
                'Festivals in ${_monthNames[selectedMonth - 1]}',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Festival list
        Expanded(
          child: festivalsInMonth.isEmpty
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.event_busy, size: 56, color: AppColors.textTertiary),
                      const SizedBox(height: 12),
                      Text(
                        'No major festivals in ${_monthNames[selectedMonth - 1]}',
                        style: TextStyle(color: AppColors.textSecondary),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Try another month!',
                        style: TextStyle(color: AppColors.textTertiary, fontSize: 13),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: festivalsInMonth.length,
                  itemBuilder: (context, index) {
                    final festival = festivalsInMonth[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      elevation: 0,
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: AppColors.border),
                        ),
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: festival.color.withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Icon(festival.icon, color: festival.color, size: 26),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    festival.name,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.textPrimary,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Row(
                                    children: [
                                      const Icon(Icons.flag_outlined, size: 13, color: AppColors.textTertiary),
                                      const SizedBox(width: 4),
                                      Text(
                                        festival.country,
                                        style: const TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w600,
                                          color: AppColors.primary,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    festival.significance,
                                    style: const TextStyle(
                                      fontSize: 13,
                                      color: AppColors.textSecondary,
                                      height: 1.4,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}

// ===========================================================================
// TAB 4 -- Sunset & Golden Hour Tracker
// ===========================================================================

class _SunsetTrackerTab extends ConsumerWidget {
  const _SunsetTrackerTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Hero gradient card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFF97316), Color(0xFFEC4899), Color(0xFF8B5CF6)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                const Icon(Icons.wb_twilight, color: AppColors.white, size: 40),
                const SizedBox(height: 10),
                const Text(
                  'Golden Hour Tracker',
                  style: TextStyle(
                    color: AppColors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Find the perfect light for photos at your destination',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: AppColors.white.withValues(alpha: 0.85),
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Section title
          Text(
            'Sunrise & Sunset Today',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
          ),
          const SizedBox(height: 12),

          // Sun data cards
          ..._sunDataEntries.map((data) => _SunDataCard(data: data)),

          const SizedBox(height: 24),

          // Golden hour tips
          Text(
            'Photography Tips',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
          ),
          const SizedBox(height: 12),
          _buildTipCard(
            Icons.camera_alt,
            'Golden Hour',
            'The warm, soft light 30-40 minutes before sunset is ideal for portraits and landscapes.',
            const Color(0xFFF97316),
          ),
          const SizedBox(height: 8),
          _buildTipCard(
            Icons.wb_sunny,
            'Blue Hour',
            'Just after sunset, the sky turns deep blue -- perfect for cityscapes and reflections.',
            const Color(0xFF3B82F6),
          ),
          const SizedBox(height: 8),
          _buildTipCard(
            Icons.alarm,
            'Set Reminders',
            'Arrive at your vantage point 20 minutes early to scout compositions and set up.',
            const Color(0xFF8B5CF6),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildTipCard(IconData icon, String title, String desc, Color color) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: ListTile(
          leading: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
          subtitle: Text(desc, style: const TextStyle(fontSize: 12, height: 1.4)),
        ),
      ),
    );
  }
}

class _SunDataCard extends StatefulWidget {
  final _SunData data;
  const _SunDataCard({required this.data});

  @override
  State<_SunDataCard> createState() => _SunDataCardState();
}

class _SunDataCardState extends State<_SunDataCard> {
  bool _reminderSet = false;

  @override
  Widget build(BuildContext context) {
    final data = widget.data;
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.border),
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // City
            Row(
              children: [
                const Icon(Icons.location_on, size: 16, color: AppColors.accent),
                const SizedBox(width: 4),
                Text(
                  data.city,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Sunrise / Sunset / Golden hour row
            Row(
              children: [
                _sunInfoChip(Icons.wb_sunny, 'Sunrise', data.sunrise, const Color(0xFFF59E0B)),
                const SizedBox(width: 12),
                _sunInfoChip(Icons.wb_twilight, 'Sunset', data.sunset, const Color(0xFFF97316)),
                const SizedBox(width: 12),
                _sunInfoChip(Icons.auto_awesome, 'Golden', '${data.goldenHourStart}-${data.goldenHourEnd}', const Color(0xFFEC4899)),
              ],
            ),
            const SizedBox(height: 12),

            // Reminder button
            SizedBox(
              width: double.infinity,
              height: 36,
              child: _reminderSet
                  ? OutlinedButton.icon(
                      onPressed: () => setState(() => _reminderSet = false),
                      icon: const Icon(Icons.notifications_active, size: 16),
                      label: const Text('Reminder Set', style: TextStyle(fontSize: 13)),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.success,
                        side: const BorderSide(color: AppColors.success),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                    )
                  : OutlinedButton.icon(
                      onPressed: () {
                        setState(() => _reminderSet = true);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Golden hour reminder set for ${data.city}'),
                            behavior: SnackBarBehavior.floating,
                            backgroundColor: AppColors.primary,
                            duration: const Duration(seconds: 2),
                          ),
                        );
                      },
                      icon: const Icon(Icons.notifications_none, size: 16),
                      label: const Text('Remind Me at Golden Hour', style: TextStyle(fontSize: 13)),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.accent,
                        side: const BorderSide(color: AppColors.accent),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _sunInfoChip(IconData icon, String label, String time, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          children: [
            Icon(icon, size: 18, color: color),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(fontSize: 10, color: color, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 2),
            Text(
              time,
              style: TextStyle(fontSize: 12, color: color, fontWeight: FontWeight.w700),
            ),
          ],
        ),
      ),
    );
  }
}
