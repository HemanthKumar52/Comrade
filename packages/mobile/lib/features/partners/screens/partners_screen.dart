import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../widgets/partner_card.dart';

class PartnersScreen extends ConsumerStatefulWidget {
  const PartnersScreen({super.key});

  @override
  ConsumerState<PartnersScreen> createState() => _PartnersScreenState();
}

class _PartnersScreenState extends ConsumerState<PartnersScreen> {
  final _searchController = TextEditingController();
  String _selectedFilter = 'all';

  final _filters = [
    {'id': 'all', 'label': 'All'},
    {'id': 'nearby', 'label': 'Nearby'},
    {'id': 'active', 'label': 'Active Now'},
    {'id': 'matched', 'label': 'Best Match'},
  ];

  final _partners = [
    {
      'id': '1',
      'name': 'Alex Chen',
      'location': 'Mumbai, India',
      'trips': 23,
      'km': 12400,
      'badges': 15,
      'isOnline': true,
      'matchScore': 92,
    },
    {
      'id': '2',
      'name': 'Sara Patel',
      'location': 'Delhi, India',
      'trips': 18,
      'km': 8900,
      'badges': 11,
      'isOnline': true,
      'matchScore': 87,
    },
    {
      'id': '3',
      'name': 'Mike Johnson',
      'location': 'Bangalore, India',
      'trips': 31,
      'km': 15600,
      'badges': 22,
      'isOnline': false,
      'matchScore': 78,
    },
    {
      'id': '4',
      'name': 'Priya Sharma',
      'location': 'Chennai, India',
      'trips': 14,
      'km': 6200,
      'badges': 9,
      'isOnline': false,
      'matchScore': 85,
    },
    {
      'id': '5',
      'name': 'David Kim',
      'location': 'Hyderabad, India',
      'trips': 27,
      'km': 11300,
      'badges': 18,
      'isOnline': true,
      'matchScore': 91,
    },
    {
      'id': '6',
      'name': 'Emily Zhang',
      'location': 'Pune, India',
      'trips': 12,
      'km': 5400,
      'badges': 7,
      'isOnline': false,
      'matchScore': 74,
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Travel Partners'),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search partners...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.tune_rounded),
                  onPressed: () {},
                ),
              ),
            ),
          ),

          // Filter Chips
          SizedBox(
            height: 40,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _filters.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final filter = _filters[index];
                final isSelected = _selectedFilter == filter['id'];
                return ChoiceChip(
                  selected: isSelected,
                  onSelected: (_) =>
                      setState(() => _selectedFilter = filter['id'] as String),
                  label: Text(filter['label'] as String),
                  selectedColor: AppColors.primary.withValues(alpha: 0.12),
                  labelStyle: TextStyle(
                    color: isSelected ? AppColors.primary : AppColors.textSecondary,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 12),

          // Partners Grid
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.78,
              ),
              itemCount: _partners.length,
              itemBuilder: (context, index) {
                return PartnerCard(
                  partner: _partners[index],
                  onTap: () =>
                      context.push('/partners/${_partners[index]['id']}'),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
