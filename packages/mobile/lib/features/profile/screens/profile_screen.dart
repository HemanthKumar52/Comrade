import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../auth/providers/auth_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final name = authState.user?['name'] ?? 'Traveler';
    final email = authState.user?['email'] ?? 'traveler@partner.app';

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              const SizedBox(height: 16),

              // Avatar
              const CircleAvatar(
                radius: 48,
                backgroundColor: AppColors.primary,
                child: Icon(Icons.person, size: 48, color: AppColors.white),
              ),
              const SizedBox(height: 12),
              Text(
                name,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
              ),
              Text(
                email,
                style: TextStyle(color: AppColors.textSecondary),
              ),
              const SizedBox(height: 20),

              // Stats Row
              Container(
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _ProfileStat(value: '7', label: 'Trips'),
                    _ProfileStat(value: '2.4K', label: 'KM'),
                    _ProfileStat(value: '15', label: 'Badges'),
                    _ProfileStat(value: '12', label: 'Streak'),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Menu Items
              _MenuSection(
                title: 'Travel',
                items: [
                  _MenuItem(
                    icon: Icons.book,
                    label: 'Digital Passport',
                    onTap: () => context.push('/passport'),
                  ),
                  _MenuItem(
                    icon: Icons.military_tech,
                    label: 'Badges',
                    onTap: () => context.push('/badges'),
                  ),
                  _MenuItem(
                    icon: Icons.note,
                    label: 'Travel Notes',
                    onTap: () => context.push('/notes'),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              _MenuSection(
                title: 'Tools',
                items: [
                  _MenuItem(
                    icon: Icons.translate,
                    label: 'Translator',
                    onTap: () => context.push('/translator'),
                  ),
                  _MenuItem(
                    icon: Icons.currency_exchange,
                    label: 'Currency Converter',
                    onTap: () => context.push('/currency'),
                  ),
                  _MenuItem(
                    icon: Icons.emergency,
                    label: 'Emergency Hub',
                    onTap: () => context.push('/emergency'),
                    color: AppColors.error,
                  ),
                  _MenuItem(
                    icon: Icons.temple_buddhist,
                    label: 'Cultural Guide',
                    onTap: () => context.push('/cultural'),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              _MenuSection(
                title: 'Account',
                items: [
                  _MenuItem(
                    icon: Icons.settings,
                    label: 'Settings',
                    onTap: () => context.push('/settings'),
                  ),
                  _MenuItem(
                    icon: Icons.logout,
                    label: 'Sign Out',
                    color: AppColors.error,
                    onTap: () async {
                      final confirmed = await showDialog<bool>(
                        context: context,
                        builder: (context) => AlertDialog(
                          title: const Text('Sign Out'),
                          content: const Text('Are you sure you want to sign out?'),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context, false),
                              child: const Text('Cancel'),
                            ),
                            ElevatedButton(
                              onPressed: () => Navigator.pop(context, true),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.error,
                              ),
                              child: const Text('Sign Out'),
                            ),
                          ],
                        ),
                      );
                      if (confirmed == true) {
                        ref.read(authProvider.notifier).logout();
                        if (context.mounted) context.go('/login');
                      }
                    },
                  ),
                ],
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}

class _ProfileStat extends StatelessWidget {
  final String value;
  final String label;

  const _ProfileStat({required this.value, required this.label});

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

class _MenuSection extends StatelessWidget {
  final String title;
  final List<_MenuItem> items;

  const _MenuSection({required this.title, required this.items});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 8),
          child: Text(
            title,
            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                ),
          ),
        ),
        Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: items.asMap().entries.map((entry) {
              final index = entry.key;
              final item = entry.value;
              return Column(
                children: [
                  item,
                  if (index < items.length - 1)
                    const Divider(height: 1, indent: 52),
                ],
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onTap;
  final Color? color;

  const _MenuItem({
    required this.icon,
    required this.label,
    this.onTap,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: color ?? AppColors.primary, size: 22),
      title: Text(
        label,
        style: TextStyle(
          fontWeight: FontWeight.w500,
          color: color,
        ),
      ),
      trailing: Icon(
        Icons.chevron_right,
        color: AppColors.textTertiary,
        size: 20,
      ),
      onTap: onTap,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    );
  }
}
