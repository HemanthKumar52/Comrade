import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../widgets/badge_card.dart';

class BadgesScreen extends ConsumerStatefulWidget {
  const BadgesScreen({super.key});

  @override
  ConsumerState<BadgesScreen> createState() => _BadgesScreenState();
}

class _BadgesScreenState extends ConsumerState<BadgesScreen> {
  String _selectedFamily = 'all';

  final _families = [
    {'id': 'all', 'label': 'All', 'color': AppColors.primary},
    {'id': 'explorer', 'label': 'Explorer', 'color': AppColors.badgeExplorer},
    {'id': 'social', 'label': 'Social', 'color': AppColors.badgeSocial},
    {'id': 'culture', 'label': 'Culture', 'color': AppColors.badgeCulture},
    {'id': 'adventure', 'label': 'Adventure', 'color': AppColors.badgeAdventure},
    {'id': 'foodie', 'label': 'Foodie', 'color': AppColors.badgeFoodie},
  ];

  final _badges = [
    {'name': 'First Steps', 'icon': Icons.hiking, 'family': 'explorer', 'level': 1, 'unlocked': true, 'progress': 1.0},
    {'name': 'Road Warrior', 'icon': Icons.directions_car, 'family': 'explorer', 'level': 2, 'unlocked': true, 'progress': 1.0},
    {'name': 'Globe Trotter', 'icon': Icons.public, 'family': 'explorer', 'level': 3, 'unlocked': false, 'progress': 0.6},
    {'name': 'Social Butterfly', 'icon': Icons.group, 'family': 'social', 'level': 1, 'unlocked': true, 'progress': 1.0},
    {'name': 'Team Player', 'icon': Icons.diversity_3, 'family': 'social', 'level': 2, 'unlocked': false, 'progress': 0.4},
    {'name': 'Culture Vulture', 'icon': Icons.temple_buddhist, 'family': 'culture', 'level': 1, 'unlocked': true, 'progress': 1.0},
    {'name': 'Heritage Hunter', 'icon': Icons.account_balance, 'family': 'culture', 'level': 2, 'unlocked': false, 'progress': 0.3},
    {'name': 'Daredevil', 'icon': Icons.paragliding, 'family': 'adventure', 'level': 1, 'unlocked': true, 'progress': 1.0},
    {'name': 'Thrill Seeker', 'icon': Icons.landscape, 'family': 'adventure', 'level': 2, 'unlocked': false, 'progress': 0.7},
    {'name': 'Local Foodie', 'icon': Icons.restaurant, 'family': 'foodie', 'level': 1, 'unlocked': true, 'progress': 1.0},
    {'name': 'Gourmet', 'icon': Icons.dining, 'family': 'foodie', 'level': 2, 'unlocked': true, 'progress': 1.0},
    {'name': 'Master Chef', 'icon': Icons.soup_kitchen, 'family': 'foodie', 'level': 3, 'unlocked': false, 'progress': 0.2},
  ];

  List<Map<String, dynamic>> get _filteredBadges {
    if (_selectedFamily == 'all') return _badges;
    return _badges.where((b) => b['family'] == _selectedFamily).toList();
  }

  int get _unlockedCount =>
      _badges.where((b) => b['unlocked'] == true).length;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Badges'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: Column(
        children: [
          // Progress Header
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppColors.primary, AppColors.primaryLight],
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
                      const Text(
                        'Badge Collection',
                        style: TextStyle(
                          color: AppColors.white,
                          fontWeight: FontWeight.w700,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '$_unlockedCount of ${_badges.length} unlocked',
                        style: TextStyle(
                          color: AppColors.white.withValues(alpha: 0.8),
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: _unlockedCount / _badges.length,
                          backgroundColor: AppColors.white.withValues(alpha: 0.2),
                          valueColor: const AlwaysStoppedAnimation(AppColors.accent),
                          minHeight: 6,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: AppColors.white.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.military_tech,
                    color: AppColors.white,
                    size: 32,
                  ),
                ),
              ],
            ),
          ),

          // Family Filters
          SizedBox(
            height: 40,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _families.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final family = _families[index];
                final isSelected = _selectedFamily == family['id'];
                final color = family['color'] as Color;
                return ChoiceChip(
                  selected: isSelected,
                  onSelected: (_) =>
                      setState(() => _selectedFamily = family['id'] as String),
                  label: Text(family['label'] as String),
                  selectedColor: color.withValues(alpha: 0.15),
                  labelStyle: TextStyle(
                    color: isSelected ? color : AppColors.textSecondary,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 12),

          // Badge Grid
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.85,
              ),
              itemCount: _filteredBadges.length,
              itemBuilder: (context, index) {
                return BadgeCard(badge: _filteredBadges[index]);
              },
            ),
          ),
        ],
      ),
    );
  }
}
