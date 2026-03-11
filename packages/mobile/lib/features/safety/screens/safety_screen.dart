import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../widgets/safety_gauge.dart';

class SafetyScreen extends StatefulWidget {
  const SafetyScreen({super.key});

  @override
  State<SafetyScreen> createState() => _SafetyScreenState();
}

class _SafetyScreenState extends State<SafetyScreen> {
  String _selectedCountry = 'Thailand';

  final List<String> _countries = [
    'Thailand',
    'Japan',
    'Vietnam',
    'Indonesia',
    'India',
    'Mexico',
    'Colombia',
    'Spain',
    'Italy',
    'Portugal',
    'Brazil',
    'South Africa',
    'Egypt',
    'Turkey',
    'Greece',
  ];

  final Map<String, double> _categoryScores = {
    'Crime': 72,
    'Health': 85,
    'Road Safety': 55,
    'Women Safety': 68,
    'LGBTQ+': 60,
    'Night Safety': 65,
    'Scam Risk': 50,
  };

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final overallScore = _categoryScores.values.reduce((a, b) => a + b) /
        _categoryScores.length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Safety Scores'),
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
            // Country Selector
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: theme.cardTheme.color,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedCountry,
                  isExpanded: true,
                  icon: const Icon(Icons.keyboard_arrow_down_rounded),
                  items: _countries
                      .map(
                          (c) => DropdownMenuItem(value: c, child: Text(c)))
                      .toList(),
                  onChanged: (v) =>
                      setState(() => _selectedCountry = v ?? _selectedCountry),
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: theme.colorScheme.onSurface,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Safety Gauge
            Center(
              child: SafetyGauge(
                score: overallScore,
                label: _selectedCountry,
                size: 220,
              ),
            ),
            const SizedBox(height: 24),

            // Category Breakdown
            Text(
              'Category Breakdown',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),
            ..._categoryScores.entries.map(
              (entry) => _buildCategoryCard(theme, entry.key, entry.value),
            ),
            const SizedBox(height: 24),

            // Common Scams
            Text(
              'Common Scams',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),
            _buildScamCard(theme, 'Gem Scam',
                'Strangers offer to take you to a "special" gem shop with incredible deals. The gems are worthless.'),
            const SizedBox(height: 8),
            _buildScamCard(theme, 'Tuk-Tuk Tour Scam',
                'Drivers offer very cheap tours but take you to commission shops instead of attractions.'),
            const SizedBox(height: 8),
            _buildScamCard(theme, 'Jet Ski Damage Scam',
                'Operators claim you damaged the jet ski and demand large repair fees for pre-existing damage.'),
            const SizedBox(height: 24),

            // Safety Tips
            Text(
              'Safety Tips',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),
            _buildTipItem(theme, Icons.copy_rounded,
                'Keep copies of passport and insurance documents'),
            _buildTipItem(theme, Icons.phone_rounded,
                'Save local emergency numbers (191 Police, 1669 Ambulance)'),
            _buildTipItem(theme, Icons.lock_rounded,
                'Use hotel safe for valuables and extra cash'),
            _buildTipItem(theme, Icons.water_drop_rounded,
                'Drink bottled water; avoid ice from unknown sources'),
            _buildTipItem(theme, Icons.directions_walk_rounded,
                'Stay on well-lit main roads at night'),
            const SizedBox(height: 24),

            // Areas to Avoid / Safe Areas
            Row(
              children: [
                Expanded(
                  child: _buildAreaCard(
                    theme,
                    title: 'Safe Areas',
                    icon: Icons.check_circle_rounded,
                    color: AppColors.success,
                    areas: ['Old City', 'Riverside', 'Mall District'],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildAreaCard(
                    theme,
                    title: 'Use Caution',
                    icon: Icons.warning_rounded,
                    color: AppColors.warning,
                    areas: ['Khao San late night', 'Patpong area', 'Remote beaches'],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryCard(ThemeData theme, String category, double score) {
    final color = score >= 75
        ? AppColors.success
        : score >= 55
            ? AppColors.warning
            : AppColors.error;

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(
              child: Icon(
                _getCategoryIcon(category),
                size: 20,
                color: color,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  category,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: theme.colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 6),
                ClipRRect(
                  borderRadius: BorderRadius.circular(3),
                  child: LinearProgressIndicator(
                    value: score / 100,
                    minHeight: 6,
                    backgroundColor: AppColors.surfaceVariant,
                    valueColor: AlwaysStoppedAnimation<Color>(color),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Text(
            '${score.round()}',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  IconData _getCategoryIcon(String category) {
    switch (category) {
      case 'Crime':
        return Icons.shield_rounded;
      case 'Health':
        return Icons.local_hospital_rounded;
      case 'Road Safety':
        return Icons.directions_car_rounded;
      case 'Women Safety':
        return Icons.woman_rounded;
      case 'LGBTQ+':
        return Icons.diversity_3_rounded;
      case 'Night Safety':
        return Icons.nightlight_round;
      case 'Scam Risk':
        return Icons.report_problem_rounded;
      default:
        return Icons.info_rounded;
    }
  }

  Widget _buildScamCard(ThemeData theme, String title, String description) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.error.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.error.withValues(alpha: 0.15)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.warning_amber_rounded,
              size: 20, color: AppColors.error),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: theme.colorScheme.onSurface,
                  ),
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

  Widget _buildTipItem(ThemeData theme, IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18, color: AppColors.info),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 13,
                color: theme.colorScheme.onSurface.withValues(alpha: 0.8),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAreaCard(
    ThemeData theme, {
    required String title,
    required IconData icon,
    required Color color,
    required List<String> areas,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 18, color: color),
              const SizedBox(width: 6),
              Text(
                title,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: color,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ...areas.map(
            (a) => Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Row(
                children: [
                  Container(
                    width: 4,
                    height: 4,
                    decoration: BoxDecoration(
                      color: color,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      a,
                      style: TextStyle(
                        fontSize: 12,
                        color: theme.colorScheme.onSurface
                            .withValues(alpha: 0.75),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
