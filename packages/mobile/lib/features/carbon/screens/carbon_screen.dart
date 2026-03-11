import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../widgets/carbon_chart.dart';

class CarbonScreen extends StatelessWidget {
  const CarbonScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Carbon Footprint'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_rounded),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Total CO2 Card
            _buildTotalCard(theme),
            const SizedBox(height: 24),

            // Trip Breakdown
            Text(
              'Trip Breakdown',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),
            const CarbonChart(
              trips: [
                CarbonTripData(tripName: 'Bangkok → Chiang Mai', kgCO2: 45.2),
                CarbonTripData(tripName: 'Tokyo → Osaka', kgCO2: 32.8),
                CarbonTripData(tripName: 'Bali Road Trip', kgCO2: 18.5),
                CarbonTripData(tripName: 'Vietnam Coast', kgCO2: 62.1),
                CarbonTripData(tripName: 'Nepal Trek', kgCO2: 8.3),
              ],
            ),
            const SizedBox(height: 24),

            // Vehicle Comparison
            Text(
              'Vehicle Comparison',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),
            _buildVehicleComparison(theme),
            const SizedBox(height: 24),

            // Offset Recommendation
            _buildOffsetCard(theme),
            const SizedBox(height: 24),

            // Green Tips
            Text(
              'Green Travel Tips',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),
            _buildTipCard(theme, Icons.train_rounded, 'Take trains over flights',
                'Trains produce up to 90% less CO\u2082 per km than flights.'),
            const SizedBox(height: 8),
            _buildTipCard(theme, Icons.pedal_bike_rounded, 'Rent bicycles locally',
                'Zero emissions and a great way to explore cities.'),
            const SizedBox(height: 8),
            _buildTipCard(theme, Icons.hotel_rounded, 'Choose eco-certified stays',
                'Look for Green Key or EarthCheck certified hotels.'),
            const SizedBox(height: 8),
            _buildTipCard(theme, Icons.water_drop_rounded, 'Carry a reusable bottle',
                'Avoid single-use plastics and reduce waste footprint.'),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildTotalCard(ThemeData theme) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF059669), Color(0xFF10B981)],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.success.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.white.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.park_rounded,
              size: 40,
              color: AppColors.white,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Lifetime Carbon Footprint',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: AppColors.white,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            '166.9 kg',
            style: TextStyle(
              fontSize: 48,
              fontWeight: FontWeight.w800,
              color: AppColors.white,
              height: 1.1,
            ),
          ),
          const Text(
            'CO\u2082 equivalent',
            style: TextStyle(
              fontSize: 14,
              color: AppColors.white,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
            decoration: BoxDecoration(
              color: AppColors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.trending_down_rounded,
                    size: 16, color: AppColors.white),
                SizedBox(width: 4),
                Text(
                  '12% less than average traveler',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.white,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVehicleComparison(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          _buildVehicleRow(theme, Icons.flight_rounded, 'Flight', 255, 255),
          const SizedBox(height: 10),
          _buildVehicleRow(theme, Icons.directions_car_rounded, 'Car', 170, 255),
          const SizedBox(height: 10),
          _buildVehicleRow(theme, Icons.train_rounded, 'Train', 40, 255),
          const SizedBox(height: 10),
          _buildVehicleRow(theme, Icons.directions_bus_rounded, 'Bus', 60, 255),
          const SizedBox(height: 10),
          _buildVehicleRow(
              theme, Icons.pedal_bike_rounded, 'Bicycle', 0, 255),
        ],
      ),
    );
  }

  Widget _buildVehicleRow(
    ThemeData theme,
    IconData icon,
    String label,
    double value,
    double max,
  ) {
    final fraction = max > 0 ? (value / max).clamp(0.0, 1.0) : 0.0;
    final color = value == 0
        ? AppColors.success
        : value < 80
            ? AppColors.success
            : value < 180
                ? AppColors.warning
                : AppColors.error;

    return Row(
      children: [
        SizedBox(
          width: 80,
          child: Row(
            children: [
              Icon(icon, size: 18, color: color),
              const SizedBox(width: 6),
              Text(
                label,
                style: TextStyle(
                  fontSize: 13,
                  color: theme.colorScheme.onSurface.withValues(alpha: 0.8),
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: fraction,
              minHeight: 8,
              backgroundColor: AppColors.surfaceVariant,
              valueColor: AlwaysStoppedAnimation<Color>(color),
            ),
          ),
        ),
        const SizedBox(width: 8),
        SizedBox(
          width: 55,
          child: Text(
            '${value.round()} g/km',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.onSurface,
            ),
            textAlign: TextAlign.right,
          ),
        ),
      ],
    );
  }

  Widget _buildOffsetCard(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.success.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.success.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.eco_rounded, size: 22, color: AppColors.success),
              SizedBox(width: 8),
              Text(
                'Offset Recommendation',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.success,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildOffsetStat(
                  theme,
                  '8',
                  'Trees to plant',
                  Icons.park_rounded,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildOffsetStat(
                  theme,
                  '\$12',
                  'Estimated cost',
                  Icons.payments_rounded,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.volunteer_activism_rounded),
              label: const Text('Offset Now'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.success,
                side: const BorderSide(color: AppColors.success),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOffsetStat(
    ThemeData theme,
    String value,
    String label,
    IconData icon,
  ) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icon, size: 24, color: AppColors.success),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w800,
              color: AppColors.success,
            ),
          ),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTipCard(
    ThemeData theme,
    IconData icon,
    String title,
    String description,
  ) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.success.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 22, color: AppColors.success),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: theme.colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 12,
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
