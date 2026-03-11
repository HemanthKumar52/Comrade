import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

class PartnerProfileScreen extends ConsumerWidget {
  final String partnerId;

  const PartnerProfileScreen({super.key, required this.partnerId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(onPressed: () {}, icon: const Icon(Icons.more_vert)),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Avatar & Name
            const CircleAvatar(
              radius: 48,
              backgroundColor: AppColors.primary,
              child: Text(
                'A',
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.w700,
                  color: AppColors.white,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Alex Chen',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w800,
                  ),
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: AppColors.success,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 6),
                Text(
                  'Online  •  Mumbai, India',
                  style: TextStyle(color: AppColors.textSecondary),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Stats Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _StatItem(value: '23', label: 'Trips'),
                _StatItem(value: '12.4K', label: 'KM'),
                _StatItem(value: '15', label: 'Badges'),
                _StatItem(value: '92%', label: 'Match'),
              ],
            ),
            const SizedBox(height: 24),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.person_add),
                    label: const Text('Connect'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.message),
                    label: const Text('Message'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // About
            _Section(
              title: 'About',
              child: const Text(
                'Adventure enthusiast and road trip lover. Always looking for new '
                'travel partners to explore hidden gems across India. Passionate '
                'about photography and local cuisines.',
              ),
            ),
            const SizedBox(height: 16),

            // Recent Trips
            _Section(
              title: 'Recent Trips',
              child: Column(
                children: [
                  _TripItem(from: 'Mumbai', to: 'Goa', date: 'Mar 2026'),
                  _TripItem(from: 'Delhi', to: 'Manali', date: 'Feb 2026'),
                  _TripItem(from: 'Jaipur', to: 'Udaipur', date: 'Jan 2026'),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Badges
            _Section(
              title: 'Badges',
              child: Wrap(
                spacing: 12,
                runSpacing: 12,
                children: [
                  _BadgeChip(label: 'Explorer', color: AppColors.badgeExplorer),
                  _BadgeChip(label: 'Foodie', color: AppColors.badgeFoodie),
                  _BadgeChip(label: 'Social', color: AppColors.badgeSocial),
                  _BadgeChip(label: 'Culture', color: AppColors.badgeCulture),
                  _BadgeChip(label: 'Adventure', color: AppColors.badgeAdventure),
                ],
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;

  const _StatItem({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: AppColors.primary,
          ),
        ),
        Text(
          label,
          style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
        ),
      ],
    );
  }
}

class _Section extends StatelessWidget {
  final String title;
  final Widget child;

  const _Section({required this.title, required this.child});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
        ),
        const SizedBox(height: 8),
        child,
      ],
    );
  }
}

class _TripItem extends StatelessWidget {
  final String from;
  final String to;
  final String date;

  const _TripItem({
    required this.from,
    required this.to,
    required this.date,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          const Icon(Icons.directions_car, size: 18, color: AppColors.accent),
          const SizedBox(width: 8),
          Expanded(
            child: Text('$from → $to',
                style: const TextStyle(fontWeight: FontWeight.w500)),
          ),
          Text(date, style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}

class _BadgeChip extends StatelessWidget {
  final String label;
  final Color color;

  const _BadgeChip({required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w600,
          fontSize: 12,
        ),
      ),
    );
  }
}
