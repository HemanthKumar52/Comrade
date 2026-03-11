import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class PhraseCard extends StatelessWidget {
  final String originalText;
  final String translation;
  final String transliteration;
  final String pronunciation;
  final bool isFavorite;
  final VoidCallback? onFavoriteToggle;
  final VoidCallback? onPlay;
  final VoidCallback? onCopy;

  const PhraseCard({
    super.key,
    required this.originalText,
    required this.translation,
    required this.transliteration,
    this.pronunciation = '',
    this.isFavorite = false,
    this.onFavoriteToggle,
    this.onPlay,
    this.onCopy,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Original text and actions row
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Text(
                  originalText,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: theme.colorScheme.onSurface,
                  ),
                ),
              ),
              // Action buttons
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _buildIconButton(
                    icon: Icons.volume_up_rounded,
                    color: AppColors.primary,
                    onTap: onPlay,
                  ),
                  const SizedBox(width: 4),
                  _buildIconButton(
                    icon: Icons.copy_rounded,
                    color: AppColors.textSecondary,
                    onTap: onCopy,
                  ),
                  const SizedBox(width: 4),
                  _buildIconButton(
                    icon: isFavorite
                        ? Icons.favorite_rounded
                        : Icons.favorite_border_rounded,
                    color:
                        isFavorite ? AppColors.error : AppColors.textSecondary,
                    onTap: onFavoriteToggle,
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Translation
          Text(
            translation,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: AppColors.accent,
            ),
          ),
          const SizedBox(height: 6),

          // Transliteration
          Text(
            transliteration,
            style: TextStyle(
              fontSize: 15,
              fontStyle: FontStyle.italic,
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
          ),

          // Pronunciation
          if (pronunciation.isNotEmpty) ...[
            const SizedBox(height: 4),
            Row(
              children: [
                Icon(
                  Icons.record_voice_over_rounded,
                  size: 14,
                  color: AppColors.textTertiary,
                ),
                const SizedBox(width: 4),
                Text(
                  pronunciation,
                  style: TextStyle(
                    fontSize: 13,
                    color: AppColors.textTertiary,
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildIconButton({
    required IconData icon,
    required Color color,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.all(6),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, size: 18, color: color),
      ),
    );
  }
}
