import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../widgets/weather_card.dart';

class WeatherScreen extends StatefulWidget {
  const WeatherScreen({super.key});

  @override
  State<WeatherScreen> createState() => _WeatherScreenState();
}

class _WeatherScreenState extends State<WeatherScreen> {
  bool _showAlerts = true;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Weather'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Current Weather
            const WeatherCard(
              temperature: 28,
              description: 'Partly Cloudy',
              icon: Icons.wb_cloudy_rounded,
              feelsLike: 31,
              humidity: 65,
              windSpeed: 12,
              uvIndex: 6,
            ),
            const SizedBox(height: 24),

            // 5-Day Forecast
            Text(
              '5-Day Forecast',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 160,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: const [
                  WeatherCard(
                    temperature: 29,
                    description: 'Sunny',
                    icon: Icons.wb_sunny_rounded,
                    feelsLike: 32,
                    humidity: 55,
                    windSpeed: 10,
                    isForecast: true,
                    dayLabel: 'Mon',
                  ),
                  SizedBox(width: 10),
                  WeatherCard(
                    temperature: 27,
                    description: 'Cloudy',
                    icon: Icons.wb_cloudy_rounded,
                    feelsLike: 29,
                    humidity: 70,
                    windSpeed: 15,
                    isForecast: true,
                    dayLabel: 'Tue',
                  ),
                  SizedBox(width: 10),
                  WeatherCard(
                    temperature: 24,
                    description: 'Rain',
                    icon: Icons.water_drop_rounded,
                    feelsLike: 23,
                    humidity: 85,
                    windSpeed: 20,
                    isForecast: true,
                    dayLabel: 'Wed',
                  ),
                  SizedBox(width: 10),
                  WeatherCard(
                    temperature: 26,
                    description: 'Partly Cloudy',
                    icon: Icons.cloud_rounded,
                    feelsLike: 28,
                    humidity: 60,
                    windSpeed: 11,
                    isForecast: true,
                    dayLabel: 'Thu',
                  ),
                  SizedBox(width: 10),
                  WeatherCard(
                    temperature: 30,
                    description: 'Sunny',
                    icon: Icons.wb_sunny_rounded,
                    feelsLike: 33,
                    humidity: 45,
                    windSpeed: 8,
                    isForecast: true,
                    dayLabel: 'Fri',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Sunrise / Sunset
            _buildSunCard(theme),
            const SizedBox(height: 16),

            // Golden Hour
            _buildGoldenHourCard(theme),
            const SizedBox(height: 24),

            // Weather Alerts
            if (_showAlerts) ...[
              Text(
                'Weather Alerts',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 12),
              _buildAlertCard(
                theme,
                icon: Icons.warning_amber_rounded,
                title: 'Heat Advisory',
                description:
                    'Temperatures expected to reach 38°C. Stay hydrated and avoid prolonged sun exposure.',
                severity: 'Moderate',
                color: AppColors.warning,
              ),
              const SizedBox(height: 8),
              _buildAlertCard(
                theme,
                icon: Icons.thunderstorm_rounded,
                title: 'Thunderstorm Warning',
                description:
                    'Isolated thunderstorms possible Wednesday evening. Seek shelter if outdoors.',
                severity: 'Watch',
                color: AppColors.info,
              ),
            ],
            const SizedBox(height: 24),

            // Route Weather Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.route_rounded),
                label: const Text('Route Weather'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accent,
                  foregroundColor: AppColors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSunCard(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Sun & Moon',
            style: theme.textTheme.titleSmall?.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildSunItem(
                  theme,
                  Icons.wb_sunny_rounded,
                  'Sunrise',
                  '6:12 AM',
                  AppColors.warning,
                ),
              ),
              Container(
                width: 1,
                height: 48,
                color: AppColors.divider,
              ),
              Expanded(
                child: _buildSunItem(
                  theme,
                  Icons.nightlight_round,
                  'Sunset',
                  '6:48 PM',
                  AppColors.primaryLight,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: 0.55,
              minHeight: 6,
              backgroundColor: AppColors.surfaceVariant,
              valueColor:
                  const AlwaysStoppedAnimation<Color>(AppColors.warning),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '12h 36m of daylight',
            style: TextStyle(
              fontSize: 12,
              color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSunItem(
    ThemeData theme,
    IconData icon,
    String label,
    String time,
    Color color,
  ) {
    return Column(
      children: [
        Icon(icon, size: 28, color: color),
        const SizedBox(height: 6),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
          ),
        ),
        Text(
          time,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: theme.colorScheme.onSurface,
          ),
        ),
      ],
    );
  }

  Widget _buildGoldenHourCard(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFFFFF3E0),
            Color(0xFFFFE0B2),
            Color(0xFFFFCC80),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.accent.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.camera_alt_rounded,
              color: AppColors.accentDark,
              size: 28,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Golden Hour',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primaryDark,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Best light for photos',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.primaryDark.withValues(alpha: 0.7),
                  ),
                ),
                const SizedBox(height: 6),
                const Row(
                  children: [
                    Icon(Icons.wb_sunny_rounded,
                        size: 14, color: AppColors.accent),
                    SizedBox(width: 4),
                    Text(
                      '6:12 - 6:48 AM',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.accentDark,
                      ),
                    ),
                    SizedBox(width: 16),
                    Icon(Icons.nightlight_round,
                        size: 14, color: AppColors.accent),
                    SizedBox(width: 4),
                    Text(
                      '6:12 - 6:48 PM',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.accentDark,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAlertCard(
    ThemeData theme, {
    required IconData icon,
    required String title,
    required String description,
    required String severity,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 20, color: color),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: theme.colorScheme.onSurface,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        severity,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: color,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 13,
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
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
