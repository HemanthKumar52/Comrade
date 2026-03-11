import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class WeatherCard extends StatelessWidget {
  final double temperature;
  final String description;
  final IconData icon;
  final double feelsLike;
  final int humidity;
  final double windSpeed;
  final int uvIndex;
  final bool isForecast;
  final String? dayLabel;

  const WeatherCard({
    super.key,
    required this.temperature,
    required this.description,
    required this.icon,
    required this.feelsLike,
    required this.humidity,
    required this.windSpeed,
    this.uvIndex = 0,
    this.isForecast = false,
    this.dayLabel,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (isForecast) {
      return _buildForecastCard(theme);
    }
    return _buildCurrentCard(theme);
  }

  Widget _buildCurrentCard(ThemeData theme) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.primary, AppColors.primaryLight],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${temperature.round()}°',
                    style: const TextStyle(
                      fontSize: 72,
                      fontWeight: FontWeight.w300,
                      color: AppColors.white,
                      height: 1,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w500,
                      color: AppColors.white,
                    ),
                  ),
                ],
              ),
              Icon(
                icon,
                size: 80,
                color: AppColors.white.withValues(alpha: 0.9),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
            decoration: BoxDecoration(
              color: AppColors.white.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildMiniStat(
                  Icons.thermostat_outlined,
                  'Feels',
                  '${feelsLike.round()}°',
                ),
                _buildDivider(),
                _buildMiniStat(
                  Icons.water_drop_outlined,
                  'Humidity',
                  '$humidity%',
                ),
                _buildDivider(),
                _buildMiniStat(
                  Icons.air,
                  'Wind',
                  '${windSpeed.round()} km/h',
                ),
                _buildDivider(),
                _buildMiniStat(
                  Icons.wb_sunny_outlined,
                  'UV',
                  '$uvIndex',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildForecastCard(ThemeData theme) {
    return Container(
      width: 100,
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            dayLabel ?? '',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
          ),
          const SizedBox(height: 8),
          Icon(icon, size: 32, color: AppColors.accent),
          const SizedBox(height: 8),
          Text(
            '${temperature.round()}°',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: theme.colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.water_drop, size: 12, color: AppColors.info),
              const SizedBox(width: 2),
              Text(
                '$humidity%',
                style: TextStyle(
                  fontSize: 11,
                  color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMiniStat(IconData statIcon, String label, String value) {
    return Column(
      children: [
        Icon(statIcon, size: 18, color: AppColors.white.withValues(alpha: 0.8)),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AppColors.white,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 11,
            color: AppColors.white.withValues(alpha: 0.7),
          ),
        ),
      ],
    );
  }

  Widget _buildDivider() {
    return Container(
      width: 1,
      height: 36,
      color: AppColors.white.withValues(alpha: 0.2),
    );
  }
}
