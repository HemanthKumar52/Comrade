import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../features/auth/providers/auth_provider.dart';
import '../widgets/stats_card.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final userName = authState.user?['name'] ?? 'Traveler';

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16),

              // Welcome Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome back,',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.textSecondary,
                            ),
                      ),
                      Text(
                        userName,
                        style:
                            Theme.of(context).textTheme.headlineSmall?.copyWith(
                                  fontWeight: FontWeight.w800,
                                ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      IconButton(
                        onPressed: () => context.push('/notes'),
                        icon: const Icon(Icons.notifications_outlined),
                      ),
                      GestureDetector(
                        onTap: () => context.push('/profile'),
                        child: const CircleAvatar(
                          radius: 20,
                          backgroundColor: AppColors.primary,
                          child: Icon(Icons.person, color: AppColors.white, size: 22),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Stats Cards Row
              const Row(
                children: [
                  Expanded(
                    child: StatsCard(
                      icon: Icons.route_rounded,
                      value: '2,450',
                      label: 'KM Traveled',
                      color: AppColors.primary,
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: StatsCard(
                      icon: Icons.place_rounded,
                      value: '18',
                      label: 'Places',
                      color: AppColors.success,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Row(
                children: [
                  Expanded(
                    child: StatsCard(
                      icon: Icons.luggage_rounded,
                      value: '7',
                      label: 'Trips',
                      color: AppColors.accent,
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: StatsCard(
                      icon: Icons.local_fire_department_rounded,
                      value: '12',
                      label: 'Day Streak',
                      color: AppColors.warning,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 28),

              // Quick Actions
              Text(
                'Quick Actions',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 90,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    _QuickAction(
                      icon: Icons.add_road_rounded,
                      label: 'New Trip',
                      color: AppColors.accent,
                      onTap: () => context.push('/trips/new'),
                    ),
                    _QuickAction(
                      icon: Icons.map_rounded,
                      label: 'Map',
                      color: AppColors.primary,
                      onTap: () => context.go('/map'),
                    ),
                    _QuickAction(
                      icon: Icons.translate_rounded,
                      label: 'Translate',
                      color: AppColors.info,
                      onTap: () => context.push('/translator'),
                    ),
                    _QuickAction(
                      icon: Icons.currency_exchange_rounded,
                      label: 'Currency',
                      color: AppColors.success,
                      onTap: () => context.push('/currency'),
                    ),
                    _QuickAction(
                      icon: Icons.emergency_rounded,
                      label: 'Emergency',
                      color: AppColors.error,
                      onTap: () => context.push('/emergency'),
                    ),
                    _QuickAction(
                      icon: Icons.temple_buddhist_rounded,
                      label: 'Culture',
                      color: AppColors.badgeCulture,
                      onTap: () => context.push('/cultural'),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Badge Showcase
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Recent Badges',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                  TextButton(
                    onPressed: () => context.push('/badges'),
                    child: const Text('See All'),
                  ),
                ],
              ),
              SizedBox(
                height: 100,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: 5,
                  separatorBuilder: (_, __) => const SizedBox(width: 12),
                  itemBuilder: (context, index) {
                    final badges = [
                      {'icon': Icons.hiking, 'name': 'First Steps', 'color': AppColors.badgeExplorer},
                      {'icon': Icons.photo_camera, 'name': 'Shutterbug', 'color': AppColors.badgeSocial},
                      {'icon': Icons.restaurant, 'name': 'Foodie', 'color': AppColors.badgeFoodie},
                      {'icon': Icons.public, 'name': 'Globe Trotter', 'color': AppColors.badgeAdventure},
                      {'icon': Icons.group, 'name': 'Social', 'color': AppColors.badgeSocial},
                    ];
                    final badge = badges[index];
                    return Column(
                      children: [
                        Container(
                          width: 56,
                          height: 56,
                          decoration: BoxDecoration(
                            color: (badge['color'] as Color).withValues(alpha: 0.12),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            badge['icon'] as IconData,
                            color: badge['color'] as Color,
                            size: 28,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          badge['name'] as String,
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500),
                        ),
                      ],
                    );
                  },
                ),
              ),
              const SizedBox(height: 28),

              // Recent Trips
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Recent Trips',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                  TextButton(
                    onPressed: () => context.go('/trips'),
                    child: const Text('See All'),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Trip Cards
              ...List.generate(3, (index) {
                final trips = [
                  {'from': 'Mumbai', 'to': 'Goa', 'date': 'Mar 5-8', 'km': '580 km', 'status': 'Completed'},
                  {'from': 'Delhi', 'to': 'Jaipur', 'date': 'Feb 28', 'km': '280 km', 'status': 'Completed'},
                  {'from': 'Bangalore', 'to': 'Ooty', 'date': 'Feb 20', 'km': '270 km', 'status': 'Completed'},
                ];
                final trip = trips[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    leading: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.accent.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.directions_car, color: AppColors.accent),
                    ),
                    title: Text(
                      '${trip['from']} → ${trip['to']}',
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                    subtitle: Text('${trip['date']}  •  ${trip['km']}'),
                    trailing: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.success.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        trip['status']!,
                        style: const TextStyle(
                          color: AppColors.success,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    onTap: () => context.push('/trips/$index'),
                  ),
                );
              }),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickAction({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 16),
      child: GestureDetector(
        onTap: onTap,
        child: Column(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(height: 6),
            Text(
              label,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
            ),
          ],
        ),
      ),
    );
  }
}
