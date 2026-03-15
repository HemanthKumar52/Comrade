import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

final selectedDestinationProvider = StateProvider<String>((ref) => 'Thailand');

final dietaryProfileProvider =
    StateNotifierProvider<DietaryProfileNotifier, Map<String, bool>>((ref) {
  return DietaryProfileNotifier();
});

class DietaryProfileNotifier extends StateNotifier<Map<String, bool>> {
  DietaryProfileNotifier()
      : super({
          'Vegetarian': false,
          'Vegan': false,
          'Halal': false,
          'Kosher': false,
          'Gluten-Free': false,
          'Dairy-Free': false,
          'Nut Allergy': false,
          'Shellfish Allergy': false,
        });

  void toggle(String key) {
    state = {...state, key: !(state[key] ?? false)};
  }
}

final menuScanResultProvider = StateProvider<String?>((ref) => null);

final restaurantFilterProvider = StateProvider<String>((ref) => 'All');

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const _destinations = [
  'Thailand',
  'Japan',
  'India',
  'Italy',
  'Mexico',
  'Morocco',
];

const _destinationData = <String, Map<String, dynamic>>{
  'Thailand': {
    'dishes': [
      {
        'name': 'Pad Thai',
        'desc': 'Stir-fried rice noodles with shrimp, peanuts & lime',
        'flavor': 'Savory / Sweet',
        'spicy': 1,
        'mustTry': 95,
        'dietary': ['Gluten-Free'],
      },
      {
        'name': 'Som Tum',
        'desc': 'Green papaya salad with chili, lime & fish sauce',
        'flavor': 'Spicy / Sour',
        'spicy': 3,
        'mustTry': 90,
        'dietary': ['Gluten-Free', 'Dairy-Free'],
      },
      {
        'name': 'Tom Yum Goong',
        'desc': 'Hot & sour shrimp soup with lemongrass & galangal',
        'flavor': 'Spicy / Sour',
        'spicy': 3,
        'mustTry': 92,
        'dietary': ['Gluten-Free', 'Dairy-Free'],
      },
      {
        'name': 'Massaman Curry',
        'desc': 'Rich peanut curry with potato & tender beef',
        'flavor': 'Savory / Sweet',
        'spicy': 1,
        'mustTry': 88,
        'dietary': ['Gluten-Free', 'Dairy-Free'],
      },
      {
        'name': 'Mango Sticky Rice',
        'desc': 'Sweet sticky rice with fresh mango & coconut cream',
        'flavor': 'Sweet',
        'spicy': 0,
        'mustTry': 93,
        'dietary': ['Vegetarian', 'Vegan', 'Gluten-Free'],
      },
      {
        'name': 'Green Curry',
        'desc': 'Coconut-based curry with Thai basil & bamboo shoots',
        'flavor': 'Spicy / Savory',
        'spicy': 2,
        'mustTry': 89,
        'dietary': ['Gluten-Free', 'Dairy-Free'],
      },
    ],
    'water': {
      'status': 'bottled',
      'note':
          'Tap water is NOT safe to drink. Use bottled or filtered water. Ice in tourist areas is generally factory-made and safe.',
    },
    'budget': {
      'street': '\$1 - \$3',
      'mid': '\$5 - \$15',
      'fine': '\$20 - \$60',
      'currency': 'THB (Thai Baht)',
    },
    'phrases': [
      {'local': 'Kor ... neung tee', 'english': 'One ... please'},
      {'local': 'Mai sai phrik', 'english': 'No chili please'},
      {'local': 'Pom/Chan pae ... ', 'english': 'I am allergic to ...'},
      {'local': 'Mai sai nom', 'english': 'No milk please'},
      {'local': 'Mang-sa-wi-rat', 'english': 'Vegetarian'},
      {'local': 'Aroy mak!', 'english': 'Very delicious!'},
    ],
    'restaurants': [
      {
        'name': 'Pad Thai Thip Samai',
        'type': 'Street Food',
        'rating': 4.7,
        'price': '\$',
        'dietary': ['Gluten-Free'],
      },
      {
        'name': 'Green Leaf Vegan',
        'type': 'Vegan',
        'rating': 4.5,
        'price': '\$\$',
        'dietary': ['Vegan', 'Vegetarian'],
      },
      {
        'name': 'Sala Rim Naam',
        'type': 'Fine Dining',
        'rating': 4.8,
        'price': '\$\$\$',
        'dietary': ['Halal'],
      },
      {
        'name': 'May Veggie Home',
        'type': 'Vegetarian',
        'rating': 4.4,
        'price': '\$',
        'dietary': ['Vegetarian', 'Vegan'],
      },
      {
        'name': 'Halal Street Bites',
        'type': 'Halal',
        'rating': 4.3,
        'price': '\$',
        'dietary': ['Halal', 'Dairy-Free'],
      },
    ],
  },
  'Japan': {
    'dishes': [
      {
        'name': 'Ramen',
        'desc': 'Rich broth with wheat noodles, chashu pork & egg',
        'flavor': 'Savory / Umami',
        'spicy': 0,
        'mustTry': 96,
        'dietary': [],
      },
      {
        'name': 'Sushi',
        'desc': 'Vinegared rice topped with fresh raw fish',
        'flavor': 'Savory / Umami',
        'spicy': 0,
        'mustTry': 98,
        'dietary': ['Dairy-Free'],
      },
      {
        'name': 'Tempura',
        'desc': 'Lightly battered & deep-fried vegetables and shrimp',
        'flavor': 'Savory',
        'spicy': 0,
        'mustTry': 85,
        'dietary': ['Dairy-Free'],
      },
      {
        'name': 'Okonomiyaki',
        'desc': 'Savory pancake with cabbage, meat & sweet sauce',
        'flavor': 'Savory / Sweet',
        'spicy': 0,
        'mustTry': 82,
        'dietary': [],
      },
      {
        'name': 'Matcha Mochi',
        'desc': 'Chewy rice cake filled with green tea cream',
        'flavor': 'Sweet',
        'spicy': 0,
        'mustTry': 80,
        'dietary': ['Vegetarian'],
      },
      {
        'name': 'Tonkatsu',
        'desc': 'Breaded deep-fried pork cutlet with shredded cabbage',
        'flavor': 'Savory',
        'spicy': 0,
        'mustTry': 87,
        'dietary': ['Dairy-Free'],
      },
    ],
    'water': {
      'status': 'safe',
      'note':
          'Tap water is safe to drink throughout Japan. Quality is excellent. Ice is safe everywhere.',
    },
    'budget': {
      'street': '\$3 - \$7',
      'mid': '\$10 - \$25',
      'fine': '\$50 - \$200',
      'currency': 'JPY (Japanese Yen)',
    },
    'phrases': [
      {'local': '... o kudasai', 'english': 'Please give me ...'},
      {'local': 'Karai mono wa dame desu', 'english': 'No spicy food please'},
      {'local': '... arerugii ga arimasu', 'english': 'I have a ... allergy'},
      {'local': 'Niku nashi de', 'english': 'Without meat'},
      {'local': 'Bejitarian', 'english': 'Vegetarian'},
      {'local': 'Oishii!', 'english': 'Delicious!'},
    ],
    'restaurants': [
      {
        'name': 'Ichiran Ramen',
        'type': 'Ramen',
        'rating': 4.6,
        'price': '\$\$',
        'dietary': ['Dairy-Free'],
      },
      {
        'name': 'Sushi Saito',
        'type': 'Fine Dining',
        'rating': 4.9,
        'price': '\$\$\$',
        'dietary': ['Dairy-Free'],
      },
      {
        'name': 'T\'s TanTan (Vegan)',
        'type': 'Vegan',
        'rating': 4.4,
        'price': '\$',
        'dietary': ['Vegan', 'Vegetarian'],
      },
    ],
  },
  'India': {
    'dishes': [
      {
        'name': 'Butter Chicken',
        'desc': 'Creamy tomato-based curry with tender chicken',
        'flavor': 'Savory / Creamy',
        'spicy': 1,
        'mustTry': 95,
        'dietary': ['Gluten-Free'],
      },
      {
        'name': 'Masala Dosa',
        'desc': 'Crispy crepe filled with spiced potatoes & chutneys',
        'flavor': 'Savory / Spicy',
        'spicy': 2,
        'mustTry': 92,
        'dietary': ['Vegetarian', 'Vegan', 'Dairy-Free'],
      },
      {
        'name': 'Biryani',
        'desc': 'Fragrant basmati rice with spiced meat & saffron',
        'flavor': 'Savory / Aromatic',
        'spicy': 2,
        'mustTry': 97,
        'dietary': ['Gluten-Free', 'Dairy-Free'],
      },
      {
        'name': 'Paneer Tikka',
        'desc': 'Grilled cottage cheese with spicy yogurt marinade',
        'flavor': 'Savory / Smoky',
        'spicy': 2,
        'mustTry': 86,
        'dietary': ['Vegetarian', 'Gluten-Free'],
      },
      {
        'name': 'Gulab Jamun',
        'desc': 'Deep-fried milk balls soaked in rose sugar syrup',
        'flavor': 'Sweet',
        'spicy': 0,
        'mustTry': 88,
        'dietary': ['Vegetarian'],
      },
      {
        'name': 'Chole Bhature',
        'desc': 'Spiced chickpea curry with deep-fried bread',
        'flavor': 'Spicy / Savory',
        'spicy': 2,
        'mustTry': 84,
        'dietary': ['Vegetarian', 'Vegan'],
      },
    ],
    'water': {
      'status': 'bottled',
      'note':
          'Do NOT drink tap water. Always use bottled or purified water. Avoid ice from unknown sources. Stick to sealed bottles.',
    },
    'budget': {
      'street': '\$0.50 - \$2',
      'mid': '\$3 - \$10',
      'fine': '\$15 - \$50',
      'currency': 'INR (Indian Rupee)',
    },
    'phrases': [
      {'local': 'Ek ... dijiye', 'english': 'Give me one ... please'},
      {'local': 'Mirch mat daaliye', 'english': 'No chili please'},
      {'local': 'Mujhe ... se allergy hai', 'english': 'I am allergic to ...'},
      {'local': 'Shakahari khana', 'english': 'Vegetarian food'},
      {'local': 'Bahut accha!', 'english': 'Very good!'},
      {'local': 'Bill de dijiye', 'english': 'Please give the bill'},
    ],
    'restaurants': [
      {
        'name': 'Karim\'s',
        'type': 'Traditional',
        'rating': 4.5,
        'price': '\$',
        'dietary': ['Halal'],
      },
      {
        'name': 'Saravana Bhavan',
        'type': 'Vegetarian',
        'rating': 4.4,
        'price': '\$',
        'dietary': ['Vegetarian'],
      },
      {
        'name': 'Indian Accent',
        'type': 'Fine Dining',
        'rating': 4.8,
        'price': '\$\$\$',
        'dietary': ['Vegetarian', 'Gluten-Free'],
      },
    ],
  },
  'Italy': {
    'dishes': [
      {
        'name': 'Margherita Pizza',
        'desc': 'Wood-fired pizza with tomato, mozzarella & basil',
        'flavor': 'Savory',
        'spicy': 0,
        'mustTry': 96,
        'dietary': ['Vegetarian'],
      },
      {
        'name': 'Carbonara',
        'desc': 'Pasta with guanciale, pecorino, egg & black pepper',
        'flavor': 'Savory / Rich',
        'spicy': 0,
        'mustTry': 94,
        'dietary': [],
      },
      {
        'name': 'Gelato',
        'desc': 'Italian-style ice cream in countless flavors',
        'flavor': 'Sweet',
        'spicy': 0,
        'mustTry': 97,
        'dietary': ['Vegetarian'],
      },
      {
        'name': 'Risotto ai Funghi',
        'desc': 'Creamy arborio rice with porcini mushrooms',
        'flavor': 'Savory / Earthy',
        'spicy': 0,
        'mustTry': 88,
        'dietary': ['Vegetarian', 'Gluten-Free'],
      },
      {
        'name': 'Bruschetta',
        'desc': 'Toasted bread with tomato, garlic, basil & olive oil',
        'flavor': 'Savory / Fresh',
        'spicy': 0,
        'mustTry': 82,
        'dietary': ['Vegetarian', 'Vegan', 'Dairy-Free'],
      },
      {
        'name': 'Tiramisu',
        'desc': 'Espresso-soaked ladyfingers with mascarpone cream',
        'flavor': 'Sweet / Coffee',
        'spicy': 0,
        'mustTry': 93,
        'dietary': ['Vegetarian'],
      },
    ],
    'water': {
      'status': 'safe',
      'note':
          'Tap water is safe throughout Italy. Public drinking fountains (nasoni) are common in Rome. Ice is safe.',
    },
    'budget': {
      'street': '\$3 - \$8',
      'mid': '\$15 - \$30',
      'fine': '\$50 - \$150',
      'currency': 'EUR (Euro)',
    },
    'phrases': [
      {'local': 'Vorrei ...', 'english': 'I would like ...'},
      {'local': 'Senza glutine', 'english': 'Gluten free'},
      {'local': 'Sono allergico/a a ...', 'english': 'I am allergic to ...'},
      {'local': 'Vegetariano', 'english': 'Vegetarian'},
      {'local': 'Il conto, per favore', 'english': 'The bill, please'},
      {'local': 'Buonissimo!', 'english': 'Delicious!'},
    ],
    'restaurants': [
      {
        'name': 'Da Enzo al 29',
        'type': 'Traditional Trattoria',
        'rating': 4.7,
        'price': '\$\$',
        'dietary': ['Vegetarian'],
      },
      {
        'name': 'Flower Burger',
        'type': 'Vegan',
        'rating': 4.3,
        'price': '\$',
        'dietary': ['Vegan', 'Vegetarian'],
      },
    ],
  },
  'Mexico': {
    'dishes': [
      {
        'name': 'Tacos al Pastor',
        'desc': 'Spit-grilled pork with pineapple on corn tortilla',
        'flavor': 'Savory / Sweet',
        'spicy': 2,
        'mustTry': 97,
        'dietary': ['Gluten-Free', 'Dairy-Free'],
      },
      {
        'name': 'Mole Poblano',
        'desc': 'Rich chocolate-chili sauce over chicken',
        'flavor': 'Savory / Complex',
        'spicy': 2,
        'mustTry': 90,
        'dietary': ['Gluten-Free'],
      },
      {
        'name': 'Elote',
        'desc': 'Grilled corn with mayo, cotija cheese, chili & lime',
        'flavor': 'Savory / Tangy',
        'spicy': 1,
        'mustTry': 88,
        'dietary': ['Vegetarian', 'Gluten-Free'],
      },
      {
        'name': 'Churros',
        'desc': 'Fried dough sticks with cinnamon sugar & chocolate',
        'flavor': 'Sweet',
        'spicy': 0,
        'mustTry': 85,
        'dietary': ['Vegetarian'],
      },
      {
        'name': 'Guacamole',
        'desc': 'Mashed avocado with lime, onion, cilantro & chili',
        'flavor': 'Savory / Fresh',
        'spicy': 1,
        'mustTry': 92,
        'dietary': [
          'Vegan',
          'Vegetarian',
          'Gluten-Free',
          'Dairy-Free',
        ],
      },
      {
        'name': 'Pozole',
        'desc': 'Hominy corn stew with pork & garnishes',
        'flavor': 'Savory',
        'spicy': 1,
        'mustTry': 83,
        'dietary': ['Gluten-Free', 'Dairy-Free'],
      },
    ],
    'water': {
      'status': 'bottled',
      'note':
          'Do NOT drink tap water. Use bottled water for drinking and brushing teeth. Be cautious with ice outside tourist hotels.',
    },
    'budget': {
      'street': '\$1 - \$4',
      'mid': '\$8 - \$18',
      'fine': '\$30 - \$80',
      'currency': 'MXN (Mexican Peso)',
    },
    'phrases': [
      {'local': 'Quiero ...', 'english': 'I want ...'},
      {'local': 'Sin picante', 'english': 'No spice please'},
      {'local': 'Soy alergico/a a ...', 'english': 'I am allergic to ...'},
      {'local': 'Sin carne', 'english': 'Without meat'},
      {'local': 'La cuenta, por favor', 'english': 'The bill, please'},
      {'local': 'Muy rico!', 'english': 'Very tasty!'},
    ],
    'restaurants': [
      {
        'name': 'El Huequito',
        'type': 'Tacos',
        'rating': 4.6,
        'price': '\$',
        'dietary': ['Gluten-Free'],
      },
      {
        'name': 'Por Siempre Vegana',
        'type': 'Vegan',
        'rating': 4.5,
        'price': '\$',
        'dietary': ['Vegan', 'Vegetarian'],
      },
    ],
  },
  'Morocco': {
    'dishes': [
      {
        'name': 'Tagine',
        'desc': 'Slow-cooked stew with meat, vegetables & spices',
        'flavor': 'Savory / Aromatic',
        'spicy': 1,
        'mustTry': 95,
        'dietary': ['Gluten-Free', 'Dairy-Free', 'Halal'],
      },
      {
        'name': 'Couscous',
        'desc': 'Steamed semolina with vegetables & meat broth',
        'flavor': 'Savory',
        'spicy': 0,
        'mustTry': 93,
        'dietary': ['Dairy-Free', 'Halal'],
      },
      {
        'name': 'Pastilla',
        'desc': 'Sweet-savory pastry with pigeon or chicken',
        'flavor': 'Sweet / Savory',
        'spicy': 0,
        'mustTry': 87,
        'dietary': ['Halal'],
      },
      {
        'name': 'Harira',
        'desc': 'Hearty tomato-lentil soup, traditional for Ramadan',
        'flavor': 'Savory / Earthy',
        'spicy': 1,
        'mustTry': 89,
        'dietary': ['Halal', 'Dairy-Free'],
      },
      {
        'name': 'Mint Tea',
        'desc': 'Gunpowder green tea with fresh mint & sugar',
        'flavor': 'Sweet / Herbal',
        'spicy': 0,
        'mustTry': 98,
        'dietary': ['Vegan', 'Vegetarian', 'Gluten-Free', 'Halal'],
      },
      {
        'name': 'Msemen',
        'desc': 'Layered square flatbread, served with honey',
        'flavor': 'Sweet / Savory',
        'spicy': 0,
        'mustTry': 80,
        'dietary': ['Vegetarian', 'Halal'],
      },
    ],
    'water': {
      'status': 'bottled',
      'note':
          'Stick to bottled water. Avoid tap water and ice from street vendors. Sealed bottles are widely available.',
    },
    'budget': {
      'street': '\$1 - \$3',
      'mid': '\$5 - \$15',
      'fine': '\$20 - \$60',
      'currency': 'MAD (Moroccan Dirham)',
    },
    'phrases': [
      {'local': 'Bghit ...', 'english': 'I want ...'},
      {'local': 'Bla haarr', 'english': 'Without spice'},
      {'local': 'Andi hassasiya men ...', 'english': 'I am allergic to ...'},
      {'local': 'Ana nabati', 'english': 'I am vegetarian'},
      {'local': 'L-hsab, afak', 'english': 'The bill, please'},
      {'local': 'Bnin bezzaf!', 'english': 'Very delicious!'},
    ],
    'restaurants': [
      {
        'name': 'Cafe Clock',
        'type': 'Traditional',
        'rating': 4.5,
        'price': '\$\$',
        'dietary': ['Halal'],
      },
      {
        'name': 'Earth Cafe',
        'type': 'Vegan',
        'rating': 4.4,
        'price': '\$',
        'dietary': ['Vegan', 'Vegetarian'],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Allergen data
// ---------------------------------------------------------------------------

const _allergenAlerts = <Map<String, dynamic>>[
  {
    'allergen': 'Peanuts / Tree Nuts',
    'icon': Icons.warning_amber_rounded,
    'color': 0xFFEF4444,
    'tips': [
      'Common in Thai, Indian & Mexican cuisines',
      'Ask: "Does this contain nuts?" in local language',
      'Carry epinephrine auto-injector at all times',
    ],
  },
  {
    'allergen': 'Shellfish',
    'icon': Icons.warning_amber_rounded,
    'color': 0xFFF97316,
    'tips': [
      'Fish sauce and shrimp paste are hidden in many Asian dishes',
      'Cross-contamination is common at seafood markets',
      'Alert restaurant staff before ordering',
    ],
  },
  {
    'allergen': 'Gluten',
    'icon': Icons.warning_amber_rounded,
    'color': 0xFFF59E0B,
    'tips': [
      'Soy sauce contains wheat in most countries',
      'Many sauces and gravies use flour as thickener',
      'Ask for rice-based alternatives',
    ],
  },
  {
    'allergen': 'Dairy / Lactose',
    'icon': Icons.warning_amber_rounded,
    'color': 0xFF3B82F6,
    'tips': [
      'Ghee (clarified butter) is widespread in Indian cooking',
      'Many baked goods contain hidden dairy',
      'Coconut-based alternatives are common in SE Asia',
    ],
  },
];

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

class FoodScreen extends ConsumerStatefulWidget {
  const FoodScreen({super.key});

  @override
  ConsumerState<FoodScreen> createState() => _FoodScreenState();
}

class _FoodScreenState extends ConsumerState<FoodScreen>
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
    final destination = ref.watch(selectedDestinationProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Food & Dietary Guide'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(100),
          child: Column(
            children: [
              // Destination chips
              SizedBox(
                height: 44,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: _destinations.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    final dest = _destinations[index];
                    final isSelected = destination == dest;
                    return ChoiceChip(
                      selected: isSelected,
                      onSelected: (_) => ref
                          .read(selectedDestinationProvider.notifier)
                          .state = dest,
                      label: Text(dest),
                      selectedColor:
                          AppColors.badgeFoodie.withValues(alpha: 0.15),
                      labelStyle: TextStyle(
                        color: isSelected
                            ? AppColors.badgeFoodie
                            : AppColors.textSecondary,
                        fontWeight:
                            isSelected ? FontWeight.w600 : FontWeight.w400,
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 4),
              // Tabs
              TabBar(
                controller: _tabController,
                isScrollable: true,
                tabAlignment: TabAlignment.start,
                labelColor: AppColors.badgeFoodie,
                unselectedLabelColor: AppColors.textSecondary,
                indicatorColor: AppColors.badgeFoodie,
                labelStyle: const TextStyle(
                    fontWeight: FontWeight.w600, fontSize: 13),
                tabs: const [
                  Tab(icon: Icon(Icons.restaurant_menu, size: 18), text: 'Dishes'),
                  Tab(icon: Icon(Icons.tune, size: 18), text: 'Dietary'),
                  Tab(icon: Icon(Icons.document_scanner, size: 18), text: 'Menu Scan'),
                  Tab(icon: Icon(Icons.water_drop, size: 18), text: 'Water Safety'),
                ],
              ),
            ],
          ),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _DishesTab(destination: destination),
          const _DietaryTab(),
          const _MenuScanTab(),
          _WaterSafetyTab(destination: destination),
        ],
      ),
    );
  }
}

// ===========================================================================
// TAB 1 - Dishes & Restaurants
// ===========================================================================

class _DishesTab extends ConsumerWidget {
  final String destination;
  const _DishesTab({required this.destination});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final data = _destinationData[destination];
    if (data == null) return _emptyState('No data for $destination yet.');

    final dishes = (data['dishes'] as List<Map<String, dynamic>>?) ?? [];
    final restaurants =
        (data['restaurants'] as List<Map<String, dynamic>>?) ?? [];
    final budget = data['budget'] as Map<String, dynamic>?;
    final phrases = (data['phrases'] as List<Map<String, dynamic>>?) ?? [];
    final filter = ref.watch(restaurantFilterProvider);

    final filteredRestaurants = filter == 'All'
        ? restaurants
        : restaurants.where((r) {
            final dietary = (r['dietary'] as List<dynamic>?) ?? [];
            return dietary.contains(filter);
          }).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ---------- Local Dish Discovery ----------
          Text(
            'Popular Local Dishes',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 0.72,
            ),
            itemCount: dishes.length,
            itemBuilder: (context, index) {
              final dish = dishes[index];
              return _DishCard(dish: dish);
            },
          ),
          const SizedBox(height: 28),

          // ---------- Food Budget Estimator ----------
          if (budget != null) ...[
            Text(
              'Food Budget Estimator',
              style: Theme.of(context)
                  .textTheme
                  .titleMedium
                  ?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 4),
            Text(
              'Local currency: ${budget['currency']}',
              style: TextStyle(
                  color: AppColors.textSecondary, fontSize: 12),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _BudgetTile(
                  label: 'Street Food',
                  range: budget['street'] as String,
                  icon: Icons.storefront,
                  color: AppColors.success,
                ),
                const SizedBox(width: 8),
                _BudgetTile(
                  label: 'Mid-Range',
                  range: budget['mid'] as String,
                  icon: Icons.restaurant,
                  color: AppColors.badgeFoodie,
                ),
                const SizedBox(width: 8),
                _BudgetTile(
                  label: 'Fine Dining',
                  range: budget['fine'] as String,
                  icon: Icons.dinner_dining,
                  color: AppColors.badgeCulture,
                ),
              ],
            ),
            const SizedBox(height: 28),
          ],

          // ---------- Restaurants ----------
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Restaurants',
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(fontWeight: FontWeight.w700),
              ),
              DropdownButton<String>(
                value: filter,
                underline: const SizedBox.shrink(),
                style: const TextStyle(fontSize: 13, color: AppColors.textPrimary),
                items: const [
                  DropdownMenuItem(value: 'All', child: Text('All')),
                  DropdownMenuItem(value: 'Vegetarian', child: Text('Vegetarian')),
                  DropdownMenuItem(value: 'Vegan', child: Text('Vegan')),
                  DropdownMenuItem(value: 'Halal', child: Text('Halal')),
                  DropdownMenuItem(value: 'Gluten-Free', child: Text('Gluten-Free')),
                  DropdownMenuItem(value: 'Dairy-Free', child: Text('Dairy-Free')),
                ],
                onChanged: (v) {
                  if (v != null) {
                    ref.read(restaurantFilterProvider.notifier).state = v;
                  }
                },
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (filteredRestaurants.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 24),
              child: Center(
                child: Text(
                  'No restaurants match "$filter" filter.',
                  style: TextStyle(color: AppColors.textSecondary),
                ),
              ),
            )
          else
            ...filteredRestaurants.map((r) => _RestaurantCard(restaurant: r)),
          const SizedBox(height: 28),

          // ---------- Safe Ordering Phrases ----------
          Text(
            'Safe Ordering Phrases',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          ...phrases.map((p) => Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: ListTile(
                  leading: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppColors.badgeFoodie.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.translate,
                        color: AppColors.badgeFoodie, size: 20),
                  ),
                  title: Text(
                    p['local'] as String,
                    style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        color: AppColors.primary),
                  ),
                  subtitle: Text(p['english'] as String),
                  trailing: IconButton(
                    icon: const Icon(Icons.volume_up, size: 20),
                    color: AppColors.accent,
                    onPressed: () {},
                  ),
                ),
              )),

          // ---------- Allergen Alerts ----------
          const SizedBox(height: 28),
          Text(
            'Allergen Alerts',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          ..._allergenAlerts.map((a) => _AllergenAlertCard(data: a)),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

// ===========================================================================
// TAB 2 - Dietary Profile
// ===========================================================================

class _DietaryTab extends ConsumerWidget {
  const _DietaryTab();

  static const _dietaryIcons = <String, IconData>{
    'Vegetarian': Icons.eco,
    'Vegan': Icons.grass,
    'Halal': Icons.mosque,
    'Kosher': Icons.synagogue,
    'Gluten-Free': Icons.no_food,
    'Dairy-Free': Icons.water_drop_outlined,
    'Nut Allergy': Icons.warning_amber_rounded,
    'Shellfish Allergy': Icons.warning_amber_rounded,
  };

  static const _dietaryColors = <String, Color>{
    'Vegetarian': AppColors.success,
    'Vegan': AppColors.badgeAdventure,
    'Halal': AppColors.badgeCulture,
    'Kosher': AppColors.info,
    'Gluten-Free': AppColors.badgeFoodie,
    'Dairy-Free': AppColors.primaryLight,
    'Nut Allergy': AppColors.error,
    'Shellfish Allergy': AppColors.accent,
  };

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(dietaryProfileProvider);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppColors.badgeFoodie, AppColors.accent],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Column(
              children: [
                Icon(Icons.person_pin, color: AppColors.white, size: 36),
                SizedBox(height: 8),
                Text(
                  'Your Dietary Profile',
                  style: TextStyle(
                    color: AppColors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Toggle your dietary needs so we can personalise dish recommendations and allergen warnings.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      color: AppColors.white, fontSize: 13, height: 1.4),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Dietary preference section
          Text(
            'Dietary Preferences',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          ...['Vegetarian', 'Vegan', 'Halal', 'Kosher'].map(
            (key) => _DietaryToggleTile(
              label: key,
              value: profile[key] ?? false,
              icon: _dietaryIcons[key]!,
              color: _dietaryColors[key]!,
              onChanged: () =>
                  ref.read(dietaryProfileProvider.notifier).toggle(key),
            ),
          ),

          const SizedBox(height: 24),
          Text(
            'Intolerances & Allergies',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          ...['Gluten-Free', 'Dairy-Free', 'Nut Allergy', 'Shellfish Allergy']
              .map(
            (key) => _DietaryToggleTile(
              label: key,
              value: profile[key] ?? false,
              icon: _dietaryIcons[key]!,
              color: _dietaryColors[key]!,
              onChanged: () =>
                  ref.read(dietaryProfileProvider.notifier).toggle(key),
            ),
          ),

          const SizedBox(height: 24),

          // Active summary
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.success.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border:
                  Border.all(color: AppColors.success.withValues(alpha: 0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.check_circle,
                        color: AppColors.success, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Active Filters',
                      style: TextStyle(
                          fontWeight: FontWeight.w700,
                          color: AppColors.success),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Builder(builder: (context) {
                  final active = profile.entries
                      .where((e) => e.value)
                      .map((e) => e.key)
                      .toList();
                  if (active.isEmpty) {
                    return Text(
                      'No dietary filters active. Toggle your preferences above.',
                      style: TextStyle(
                          color: AppColors.textSecondary, fontSize: 13),
                    );
                  }
                  return Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: active
                        .map((a) => Chip(
                              label: Text(a,
                                  style: const TextStyle(fontSize: 12)),
                              backgroundColor:
                                  (_dietaryColors[a] ?? AppColors.primary)
                                      .withValues(alpha: 0.12),
                              side: BorderSide.none,
                              visualDensity: VisualDensity.compact,
                            ))
                        .toList(),
                  );
                }),
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
// TAB 3 - Menu Scan
// ===========================================================================

class _MenuScanTab extends ConsumerWidget {
  const _MenuScanTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scanResult = ref.watch(menuScanResultProvider);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Camera hero area
          Container(
            width: double.infinity,
            height: 220,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                  color: AppColors.primary.withValues(alpha: 0.15)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: AppColors.badgeFoodie.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.camera_alt,
                      color: AppColors.badgeFoodie, size: 36),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Scan a Menu',
                  style: TextStyle(
                      fontSize: 18, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 4),
                Text(
                  'Point your camera at a menu to translate\nand detect allergens automatically',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 13,
                      height: 1.4),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Action buttons
          Row(
            children: [
              Expanded(
                child: FilledButton.icon(
                  onPressed: () {
                    // Simulated scan result
                    ref.read(menuScanResultProvider.notifier).state =
                        'Detected menu items:\n\n'
                        '1. Pad Kra Pao - Stir-fried basil with pork\n'
                        '   Contains: Fish sauce, Oyster sauce\n'
                        '   Spice level: Hot\n\n'
                        '2. Khao Pad - Fried rice with egg\n'
                        '   Contains: Soy sauce, Egg\n'
                        '   Spice level: Mild\n\n'
                        '3. Tom Kha Gai - Coconut chicken soup\n'
                        '   Contains: Coconut milk, Galangal\n'
                        '   Spice level: Medium\n\n'
                        '4. Som Tum - Papaya salad\n'
                        '   Contains: Fish sauce, Peanuts, Shrimp\n'
                        '   Spice level: Very hot';
                  },
                  icon: const Icon(Icons.camera_alt, size: 18),
                  label: const Text('Take Photo'),
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.badgeFoodie,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    ref.read(menuScanResultProvider.notifier).state =
                        'Detected menu items:\n\n'
                        '1. Margherita Pizza - Tomato, mozzarella, basil\n'
                        '   Contains: Gluten, Dairy\n'
                        '   Allergen warning: Gluten, Dairy\n\n'
                        '2. Pasta Carbonara - Guanciale, egg, pecorino\n'
                        '   Contains: Gluten, Dairy, Egg\n'
                        '   Allergen warning: Gluten, Dairy\n\n'
                        '3. Insalata Caprese - Tomato & mozzarella\n'
                        '   Contains: Dairy\n'
                        '   Allergen warning: Dairy';
                  },
                  icon: const Icon(Icons.photo_library, size: 18),
                  label: const Text('From Gallery'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.badgeFoodie,
                    side: const BorderSide(color: AppColors.badgeFoodie),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Scan result
          if (scanResult != null) ...[
            Text(
              'Translation Result',
              style: Theme.of(context)
                  .textTheme
                  .titleMedium
                  ?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.translate,
                          color: AppColors.badgeFoodie, size: 18),
                      const SizedBox(width: 8),
                      const Text(
                        'Translated Menu',
                        style: TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 14),
                      ),
                      const Spacer(),
                      TextButton.icon(
                        onPressed: () => ref
                            .read(menuScanResultProvider.notifier)
                            .state = null,
                        icon: const Icon(Icons.close, size: 16),
                        label: const Text('Clear'),
                        style: TextButton.styleFrom(
                          foregroundColor: AppColors.textSecondary,
                          visualDensity: VisualDensity.compact,
                        ),
                      ),
                    ],
                  ),
                  const Divider(),
                  const SizedBox(height: 4),
                  Text(
                    scanResult,
                    style: const TextStyle(fontSize: 13, height: 1.6),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Allergen match notice
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.warning.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                    color: AppColors.warning.withValues(alpha: 0.3)),
              ),
              child: const Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.warning_amber_rounded,
                      color: AppColors.warning, size: 22),
                  SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Allergen Check',
                          style: TextStyle(
                              fontWeight: FontWeight.w700, fontSize: 14),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Items flagged based on your dietary profile. Always confirm with staff before ordering.',
                          style: TextStyle(fontSize: 12, height: 1.4),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ] else ...[
            // How it works
            Text(
              'How It Works',
              style: Theme.of(context)
                  .textTheme
                  .titleMedium
                  ?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 12),
            _HowItWorksStep(
              step: '1',
              title: 'Point & Capture',
              desc: 'Take a photo of the menu or select from gallery',
              icon: Icons.camera_alt,
            ),
            _HowItWorksStep(
              step: '2',
              title: 'Instant Translation',
              desc: 'AI translates menu items to your preferred language',
              icon: Icons.translate,
            ),
            _HowItWorksStep(
              step: '3',
              title: 'Allergen Detection',
              desc:
                  'Automatically flags items that conflict with your dietary profile',
              icon: Icons.shield,
            ),
            _HowItWorksStep(
              step: '4',
              title: 'Safe Ordering',
              desc: 'Get safe ordering phrases to communicate with staff',
              icon: Icons.check_circle_outline,
            ),
          ],
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

// ===========================================================================
// TAB 4 - Water Safety
// ===========================================================================

class _WaterSafetyTab extends StatelessWidget {
  final String destination;
  const _WaterSafetyTab({required this.destination});

  @override
  Widget build(BuildContext context) {
    final data = _destinationData[destination];
    final water = data?['water'] as Map<String, dynamic>?;
    final budget = data?['budget'] as Map<String, dynamic>?;

    if (water == null) return _emptyState('No water data for $destination.');

    final status = water['status'] as String;
    final note = water['note'] as String;

    Color statusColor;
    IconData statusIcon;
    String statusLabel;
    switch (status) {
      case 'safe':
        statusColor = AppColors.success;
        statusIcon = Icons.check_circle;
        statusLabel = 'TAP WATER SAFE';
        break;
      case 'boil':
        statusColor = AppColors.warning;
        statusIcon = Icons.local_fire_department;
        statusLabel = 'BOIL BEFORE DRINKING';
        break;
      default:
        statusColor = AppColors.error;
        statusIcon = Icons.dangerous;
        statusLabel = 'USE BOTTLED WATER';
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Status hero
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  statusColor.withValues(alpha: 0.15),
                  statusColor.withValues(alpha: 0.05),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              border:
                  Border.all(color: statusColor.withValues(alpha: 0.3)),
            ),
            child: Column(
              children: [
                Icon(statusIcon, color: statusColor, size: 48),
                const SizedBox(height: 12),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    statusLabel,
                    style: TextStyle(
                      color: statusColor,
                      fontWeight: FontWeight.w800,
                      fontSize: 16,
                      letterSpacing: 1,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  destination,
                  style: const TextStyle(
                      fontSize: 18, fontWeight: FontWeight.w700),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Detail note
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.info_outline,
                        color: AppColors.info, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Water Safety Details',
                      style: TextStyle(
                          fontWeight: FontWeight.w700, fontSize: 14),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  note,
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 13,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Ice safety
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
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
                    Icon(Icons.ac_unit,
                        color: AppColors.warning, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Ice Safety Note',
                      style: TextStyle(
                          fontWeight: FontWeight.w700, fontSize: 14),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  status == 'safe'
                      ? 'Ice is safe to consume everywhere in $destination.'
                      : 'Be cautious with ice from street vendors. Factory-made cylindrical ice (with a hole in the centre) is generally safe. Crushed or irregularly shaped ice may be made from untreated water.',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 13,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Tips
          Text(
            'Hydration Tips',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          _WaterTipCard(
            icon: Icons.shopping_bag,
            title: 'Carry a Reusable Bottle',
            desc: status == 'safe'
                ? 'Refill freely from taps and public fountains.'
                : 'Fill from sealed bottled water to reduce plastic waste.',
          ),
          _WaterTipCard(
            icon: Icons.local_drink,
            title: 'Stay Hydrated',
            desc:
                'Drink at least 2-3 litres daily, especially in hot climates. Increase intake if active.',
          ),
          _WaterTipCard(
            icon: Icons.medical_services,
            title: 'Signs of Dehydration',
            desc:
                'Watch for dark urine, dizziness, dry mouth, or fatigue. Seek shade and rehydrate immediately.',
          ),
          _WaterTipCard(
            icon: Icons.local_cafe,
            title: 'Safe Alternatives',
            desc:
                'Hot tea, coffee, and sealed beverages are generally safe anywhere.',
          ),

          // Budget reminder
          if (budget != null) ...[
            const SizedBox(height: 20),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.info.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                    color: AppColors.info.withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.payments,
                      color: AppColors.info, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Bottled water costs roughly \$0.30 - \$1.00 in $destination. Budget accordingly for daily hydration.',
                      style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 12,
                          height: 1.4),
                    ),
                  ),
                ],
              ),
            ),
          ],
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

// ===========================================================================
// Reusable Widgets
// ===========================================================================

Widget _emptyState(String message) {
  return Center(
    child: Padding(
      padding: const EdgeInsets.all(48),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.restaurant, size: 64, color: AppColors.textTertiary),
          const SizedBox(height: 16),
          Text(
            message,
            textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.textSecondary),
          ),
        ],
      ),
    ),
  );
}

// ---------- Dish Card ----------

class _DishCard extends StatelessWidget {
  final Map<String, dynamic> dish;
  const _DishCard({required this.dish});

  @override
  Widget build(BuildContext context) {
    final name = dish['name'] as String;
    final desc = dish['desc'] as String;
    final flavor = dish['flavor'] as String;
    final spicy = dish['spicy'] as int;
    final mustTry = dish['mustTry'] as int;
    final dietary = (dish['dietary'] as List<dynamic>?) ?? [];

    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Photo placeholder
          Container(
            height: 88,
            width: double.infinity,
            color: AppColors.badgeFoodie.withValues(alpha: 0.1),
            child: Center(
              child: Icon(Icons.restaurant,
                  size: 32,
                  color: AppColors.badgeFoodie.withValues(alpha: 0.5)),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(10, 8, 10, 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Name + must-try
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          name,
                          style: const TextStyle(
                              fontWeight: FontWeight.w700, fontSize: 13),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.badgeFoodie.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '$mustTry%',
                          style: const TextStyle(
                            color: AppColors.badgeFoodie,
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    desc,
                    style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 10,
                        height: 1.3),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const Spacer(),
                  // Flavor + spice
                  Row(
                    children: [
                      Icon(Icons.local_fire_department,
                          size: 12,
                          color: spicy > 0
                              ? AppColors.error
                              : AppColors.textTertiary),
                      const SizedBox(width: 2),
                      Expanded(
                        child: Text(
                          flavor,
                          style: TextStyle(
                              fontSize: 10, color: AppColors.textTertiary),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  if (dietary.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Wrap(
                      spacing: 4,
                      runSpacing: 2,
                      children: dietary
                          .take(2)
                          .map((d) => Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 4, vertical: 1),
                                decoration: BoxDecoration(
                                  color: AppColors.success
                                      .withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  d as String,
                                  style: const TextStyle(
                                      fontSize: 8,
                                      color: AppColors.success,
                                      fontWeight: FontWeight.w600),
                                ),
                              ))
                          .toList(),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ---------- Budget Tile ----------

class _BudgetTile extends StatelessWidget {
  final String label;
  final String range;
  final IconData icon;
  final Color color;

  const _BudgetTile({
    required this.label,
    required this.range,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withValues(alpha: 0.2)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 6),
            Text(
              label,
              style: TextStyle(
                  fontSize: 10,
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 2),
            Text(
              range,
              style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: color),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------- Restaurant Card ----------

class _RestaurantCard extends StatelessWidget {
  final Map<String, dynamic> restaurant;
  const _RestaurantCard({required this.restaurant});

  @override
  Widget build(BuildContext context) {
    final name = restaurant['name'] as String;
    final type = restaurant['type'] as String;
    final rating = restaurant['rating'] as double;
    final price = restaurant['price'] as String;
    final dietary = (restaurant['dietary'] as List<dynamic>?) ?? [];

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: AppColors.badgeFoodie.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: const Icon(Icons.restaurant,
              color: AppColors.badgeFoodie, size: 22),
        ),
        title: Text(name, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('$type  |  $price', style: const TextStyle(fontSize: 12)),
            if (dietary.isNotEmpty)
              Wrap(
                spacing: 4,
                children: dietary
                    .map((d) => Text(
                          d as String,
                          style: TextStyle(
                              fontSize: 10,
                              color: AppColors.success,
                              fontWeight: FontWeight.w600),
                        ))
                    .toList(),
              ),
          ],
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.star, color: AppColors.warning, size: 16),
            const SizedBox(width: 2),
            Text(
              rating.toString(),
              style: const TextStyle(
                  fontWeight: FontWeight.w600, fontSize: 13),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------- Allergen Alert Card ----------

class _AllergenAlertCard extends StatelessWidget {
  final Map<String, dynamic> data;
  const _AllergenAlertCard({required this.data});

  @override
  Widget build(BuildContext context) {
    final allergen = data['allergen'] as String;
    final icon = data['icon'] as IconData;
    final color = Color(data['color'] as int);
    final tips = (data['tips'] as List<dynamic>?) ?? [];

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.25)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 22),
              const SizedBox(width: 8),
              Text(
                allergen,
                style:
                    TextStyle(fontWeight: FontWeight.w700, color: color),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ...tips.map((t) => Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('  ',
                        style: TextStyle(
                            color: AppColors.textSecondary, fontSize: 12)),
                    Expanded(
                      child: Text(
                        t as String,
                        style: TextStyle(
                            fontSize: 12,
                            height: 1.4,
                            color: AppColors.textSecondary),
                      ),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }
}

// ---------- Dietary Toggle Tile ----------

class _DietaryToggleTile extends StatelessWidget {
  final String label;
  final bool value;
  final IconData icon;
  final Color color;
  final VoidCallback onChanged;

  const _DietaryToggleTile({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: SwitchListTile(
        value: value,
        onChanged: (_) => onChanged(),
        activeColor: color,
        secondary: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: color, size: 22),
        ),
        title: Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
      ),
    );
  }
}

// ---------- How It Works Step ----------

class _HowItWorksStep extends StatelessWidget {
  final String step;
  final String title;
  final String desc;
  final IconData icon;

  const _HowItWorksStep({
    required this.step,
    required this.title,
    required this.desc,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: AppColors.badgeFoodie.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Center(
            child: Text(
              step,
              style: const TextStyle(
                color: AppColors.badgeFoodie,
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
          ),
        ),
        title:
            Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Text(desc, style: const TextStyle(fontSize: 12)),
        trailing: Icon(icon, color: AppColors.badgeFoodie, size: 22),
      ),
    );
  }
}

// ---------- Water Tip Card ----------

class _WaterTipCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String desc;

  const _WaterTipCard({
    required this.icon,
    required this.title,
    required this.desc,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: AppColors.info.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: AppColors.info, size: 22),
        ),
        title:
            Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle:
            Text(desc, style: const TextStyle(fontSize: 12, height: 1.3)),
      ),
    );
  }
}
