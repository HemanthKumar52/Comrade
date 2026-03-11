import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class CarbonTripData {
  final String tripName;
  final double kgCO2;

  const CarbonTripData({required this.tripName, required this.kgCO2});
}

class CarbonChart extends StatelessWidget {
  final List<CarbonTripData> trips;
  final double maxValue;

  const CarbonChart({
    super.key,
    required this.trips,
    double? maxValue,
  }) : maxValue = maxValue ?? 0;

  double get _effectiveMax {
    if (maxValue > 0) return maxValue;
    if (trips.isEmpty) return 100;
    return trips.map((t) => t.kgCO2).reduce((a, b) => a > b ? a : b) * 1.1;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final total = trips.fold<double>(0, (sum, t) => sum + t.kgCO2);

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
          Text(
            'CO\u2082 by Trip',
            style: theme.textTheme.titleSmall?.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 16),
          ...trips.map((trip) => _buildBar(theme, trip)),
          const Divider(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Total',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: theme.colorScheme.onSurface,
                ),
              ),
              Text(
                '${total.toStringAsFixed(1)} kg',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.success,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBar(ThemeData theme, CarbonTripData trip) {
    final fraction = trip.kgCO2 / _effectiveMax;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  trip.tripName,
                  style: TextStyle(
                    fontSize: 13,
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.8),
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Text(
                '${trip.kgCO2.toStringAsFixed(1)} kg',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: theme.colorScheme.onSurface,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: fraction.clamp(0.0, 1.0),
              minHeight: 8,
              backgroundColor: AppColors.surfaceVariant,
              valueColor:
                  const AlwaysStoppedAnimation<Color>(AppColors.success),
            ),
          ),
        ],
      ),
    );
  }
}
