import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class BadgeCard extends StatelessWidget {
  final Map<String, dynamic> badge;

  const BadgeCard({super.key, required this.badge});

  Color _getFamilyColor(String family) {
    switch (family) {
      case 'explorer':
        return AppColors.badgeExplorer;
      case 'social':
        return AppColors.badgeSocial;
      case 'culture':
        return AppColors.badgeCulture;
      case 'adventure':
        return AppColors.badgeAdventure;
      case 'foodie':
        return AppColors.badgeFoodie;
      default:
        return AppColors.primary;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isUnlocked = badge['unlocked'] as bool;
    final family = badge['family'] as String;
    final color = _getFamilyColor(family);
    final progress = badge['progress'] as double;
    final level = badge['level'] as int;

    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isUnlocked ? color.withValues(alpha: 0.3) : AppColors.border,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Badge Icon
            Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 52,
                  height: 52,
                  child: CircularProgressIndicator(
                    value: progress,
                    backgroundColor: AppColors.border,
                    valueColor: AlwaysStoppedAnimation(
                      isUnlocked ? color : AppColors.textTertiary,
                    ),
                    strokeWidth: 3,
                  ),
                ),
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: isUnlocked
                        ? color.withValues(alpha: 0.12)
                        : AppColors.surfaceVariant,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    badge['icon'] as IconData,
                    color: isUnlocked ? color : AppColors.textTertiary,
                    size: 22,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Name
            Text(
              badge['name'] as String,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: isUnlocked ? null : AppColors.textTertiary,
              ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),

            // Level & Family Tag
            const SizedBox(height: 2),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    'Lv.$level',
                    style: TextStyle(
                      fontSize: 9,
                      color: color,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
