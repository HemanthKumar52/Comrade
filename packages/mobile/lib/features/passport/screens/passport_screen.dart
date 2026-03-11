import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

class PassportScreen extends ConsumerWidget {
  const PassportScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stamps = [
      {'city': 'Mumbai', 'country': 'India', 'date': 'Jan 2026', 'icon': Icons.location_city, 'color': AppColors.accent},
      {'city': 'Goa', 'country': 'India', 'date': 'Mar 2026', 'icon': Icons.beach_access, 'color': AppColors.success},
      {'city': 'Jaipur', 'country': 'India', 'date': 'Feb 2026', 'icon': Icons.account_balance, 'color': AppColors.badgeCulture},
      {'city': 'Delhi', 'country': 'India', 'date': 'Feb 2026', 'icon': Icons.mosque, 'color': AppColors.primary},
      {'city': 'Bangalore', 'country': 'India', 'date': 'Feb 2026', 'icon': Icons.park, 'color': AppColors.badgeExplorer},
      {'city': 'Ooty', 'country': 'India', 'date': 'Feb 2026', 'icon': Icons.landscape, 'color': AppColors.badgeAdventure},
      {'city': 'Manali', 'country': 'India', 'date': 'Jan 2026', 'icon': Icons.ac_unit, 'color': AppColors.info},
      {'city': 'Udaipur', 'country': 'India', 'date': 'Jan 2026', 'icon': Icons.water, 'color': AppColors.badgeSocial},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Digital Passport'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Passport Cover
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.primary, AppColors.primaryDark],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withValues(alpha: 0.3),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Column(
                children: [
                  const Icon(
                    Icons.public,
                    color: AppColors.white,
                    size: 48,
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'PARTNER PASSPORT',
                    style: TextStyle(
                      color: AppColors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Traveler',
                    style: TextStyle(
                      color: AppColors.white.withValues(alpha: 0.8),
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _PassportStat(value: '${stamps.length}', label: 'Stamps'),
                      _PassportStat(value: '1', label: 'Countries'),
                      _PassportStat(value: '${stamps.length}', label: 'Cities'),
                    ],
                  ),
                ],
              ),
            ),

            // Stamps Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Text(
                    'Stamps',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                  const Spacer(),
                  Text(
                    '${stamps.length} collected',
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Stamps Grid
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.8,
              ),
              itemCount: stamps.length + 4, // extra empty slots
              itemBuilder: (context, index) {
                if (index < stamps.length) {
                  final stamp = stamps[index];
                  return _StampTile(stamp: stamp);
                }
                // Empty slot
                return Container(
                  decoration: BoxDecoration(
                    color: AppColors.surfaceVariant,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AppColors.border,
                      style: BorderStyle.solid,
                    ),
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.lock_outline,
                      color: AppColors.disabled,
                      size: 20,
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}

class _PassportStat extends StatelessWidget {
  final String value;
  final String label;

  const _PassportStat({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: AppColors.white,
            fontSize: 22,
            fontWeight: FontWeight.w800,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            color: AppColors.white.withValues(alpha: 0.7),
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}

class _StampTile extends StatelessWidget {
  final Map<String, dynamic> stamp;

  const _StampTile({required this.stamp});

  @override
  Widget build(BuildContext context) {
    final color = stamp['color'] as Color;

    return Container(
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            stamp['icon'] as IconData,
            color: color,
            size: 24,
          ),
          const SizedBox(height: 4),
          Text(
            stamp['city'] as String,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              color: color,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          Text(
            stamp['date'] as String,
            style: TextStyle(
              fontSize: 8,
              color: AppColors.textTertiary,
            ),
          ),
        ],
      ),
    );
  }
}
