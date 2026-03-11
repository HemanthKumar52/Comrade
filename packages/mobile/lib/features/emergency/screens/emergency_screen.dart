import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../widgets/sos_button.dart';

class EmergencyScreen extends ConsumerWidget {
  const EmergencyScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Emergency Hub'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        backgroundColor: AppColors.error.withValues(alpha: 0.05),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // SOS Button
            const Center(
              child: SOSButton(),
            ),
            const SizedBox(height: 8),
            Text(
              'Long press for 3 seconds to activate SOS',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
            ),
            const SizedBox(height: 28),

            // Emergency Contacts
            Text(
              'Emergency Contacts',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
            ),
            const SizedBox(height: 12),
            _EmergencyContactCard(
              icon: Icons.local_police,
              title: 'Police',
              number: '100',
              color: AppColors.primary,
            ),
            _EmergencyContactCard(
              icon: Icons.local_hospital,
              title: 'Ambulance',
              number: '108',
              color: AppColors.error,
            ),
            _EmergencyContactCard(
              icon: Icons.fire_truck,
              title: 'Fire Department',
              number: '101',
              color: AppColors.accent,
            ),
            _EmergencyContactCard(
              icon: Icons.woman,
              title: 'Women Helpline',
              number: '1091',
              color: AppColors.badgeSocial,
            ),
            const SizedBox(height: 24),

            // Personal Emergency Contacts
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Personal Contacts',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                ),
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.add, size: 18),
                  label: const Text('Add'),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Card(
              margin: EdgeInsets.zero,
              child: ListTile(
                leading: const CircleAvatar(
                  backgroundColor: AppColors.primary,
                  child: Text('M', style: TextStyle(color: AppColors.white)),
                ),
                title: const Text('Mom'),
                subtitle: const Text('+91 98765 43210'),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.phone, color: AppColors.success),
                      onPressed: () {},
                    ),
                    IconButton(
                      icon: const Icon(Icons.message, color: AppColors.info),
                      onPressed: () {},
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Nearby Hospitals
            Text(
              'Nearby Hospitals',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
            ),
            const SizedBox(height: 12),
            _NearbyCard(
              icon: Icons.local_hospital,
              title: 'City General Hospital',
              subtitle: '2.3 km away - Open 24/7',
              rating: '4.2',
            ),
            _NearbyCard(
              icon: Icons.local_hospital,
              title: 'Apollo Hospital',
              subtitle: '4.1 km away - Open 24/7',
              rating: '4.5',
            ),
            _NearbyCard(
              icon: Icons.local_pharmacy,
              title: 'MedPlus Pharmacy',
              subtitle: '0.8 km away - Open till 10 PM',
              rating: '4.0',
            ),
            const SizedBox(height: 24),

            // Safety Tips
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.warning.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.warning.withValues(alpha: 0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.tips_and_updates, color: AppColors.warning, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'Safety Tips',
                        style: TextStyle(fontWeight: FontWeight.w700),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '- Share your live location with trusted contacts\n'
                    '- Keep emergency numbers saved offline\n'
                    '- Carry basic first aid supplies\n'
                    '- Know the nearest hospital before heading out',
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
      ),
    );
  }
}

class _EmergencyContactCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String number;
  final Color color;

  const _EmergencyContactCard({
    required this.icon,
    required this.title,
    required this.number,
    required this.color,
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
            color: color.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: color, size: 22),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Text(number),
        trailing: Container(
          decoration: BoxDecoration(
            color: AppColors.success.withValues(alpha: 0.12),
            shape: BoxShape.circle,
          ),
          child: IconButton(
            icon: const Icon(Icons.phone, color: AppColors.success, size: 20),
            onPressed: () {},
          ),
        ),
      ),
    );
  }
}

class _NearbyCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final String rating;

  const _NearbyCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.rating,
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
            color: AppColors.error.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: AppColors.error, size: 22),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 12)),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.star, color: AppColors.warning, size: 16),
            const SizedBox(width: 2),
            Text(rating, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
          ],
        ),
      ),
    );
  }
}
