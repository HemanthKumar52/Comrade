import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _notificationsEnabled = true;
  bool _locationTracking = true;
  bool _darkMode = false;
  bool _offlineMaps = false;
  String _mapStyle = 'Standard';
  String _distanceUnit = 'Kilometers';
  String _language = 'English';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: ListView(
        children: [
          // Profile Section
          _SectionHeader(title: 'Profile'),
          _SettingsTile(
            icon: Icons.person,
            title: 'Edit Profile',
            subtitle: 'Name, photo, bio',
            onTap: () {},
          ),
          _SettingsTile(
            icon: Icons.verified_user,
            title: 'Verify Account',
            subtitle: 'Get a verified badge',
            onTap: () {},
          ),
          const Divider(height: 32),

          // Privacy Section
          _SectionHeader(title: 'Privacy'),
          _SettingsTile(
            icon: Icons.visibility,
            title: 'Profile Visibility',
            subtitle: 'Who can see your profile',
            onTap: () {},
          ),
          SwitchListTile(
            secondary: const Icon(Icons.location_on, color: AppColors.primary),
            title: const Text('Location Tracking'),
            subtitle: const Text('Share location during trips'),
            value: _locationTracking,
            onChanged: (value) => setState(() => _locationTracking = value),
            activeColor: AppColors.accent,
          ),
          _SettingsTile(
            icon: Icons.block,
            title: 'Blocked Users',
            subtitle: 'Manage blocked accounts',
            onTap: () {},
          ),
          const Divider(height: 32),

          // Notifications Section
          _SectionHeader(title: 'Notifications'),
          SwitchListTile(
            secondary: const Icon(Icons.notifications, color: AppColors.primary),
            title: const Text('Push Notifications'),
            subtitle: const Text('Trip updates, messages, badges'),
            value: _notificationsEnabled,
            onChanged: (value) =>
                setState(() => _notificationsEnabled = value),
            activeColor: AppColors.accent,
          ),
          _SettingsTile(
            icon: Icons.tune,
            title: 'Notification Preferences',
            subtitle: 'Customize which notifications to receive',
            onTap: () {},
          ),
          const Divider(height: 32),

          // Map Section
          _SectionHeader(title: 'Map'),
          ListTile(
            leading: const Icon(Icons.map, color: AppColors.primary),
            title: const Text('Map Style'),
            subtitle: Text(_mapStyle),
            trailing: const Icon(Icons.chevron_right, size: 20),
            onTap: () {
              showDialog(
                context: context,
                builder: (context) => SimpleDialog(
                  title: const Text('Map Style'),
                  children: ['Standard', 'Satellite', 'Terrain', 'Dark']
                      .map((style) => SimpleDialogOption(
                            child: Text(style),
                            onPressed: () {
                              setState(() => _mapStyle = style);
                              Navigator.pop(context);
                            },
                          ))
                      .toList(),
                ),
              );
            },
          ),
          SwitchListTile(
            secondary:
                const Icon(Icons.download_for_offline, color: AppColors.primary),
            title: const Text('Offline Maps'),
            subtitle: const Text('Download maps for offline use'),
            value: _offlineMaps,
            onChanged: (value) => setState(() => _offlineMaps = value),
            activeColor: AppColors.accent,
          ),
          ListTile(
            leading: const Icon(Icons.straighten, color: AppColors.primary),
            title: const Text('Distance Unit'),
            subtitle: Text(_distanceUnit),
            trailing: const Icon(Icons.chevron_right, size: 20),
            onTap: () {
              showDialog(
                context: context,
                builder: (context) => SimpleDialog(
                  title: const Text('Distance Unit'),
                  children: ['Kilometers', 'Miles']
                      .map((unit) => SimpleDialogOption(
                            child: Text(unit),
                            onPressed: () {
                              setState(() => _distanceUnit = unit);
                              Navigator.pop(context);
                            },
                          ))
                      .toList(),
                ),
              );
            },
          ),
          const Divider(height: 32),

          // Language Section
          _SectionHeader(title: 'Language'),
          ListTile(
            leading: const Icon(Icons.language, color: AppColors.primary),
            title: const Text('App Language'),
            subtitle: Text(_language),
            trailing: const Icon(Icons.chevron_right, size: 20),
            onTap: () {
              showDialog(
                context: context,
                builder: (context) => SimpleDialog(
                  title: const Text('Language'),
                  children: [
                    'English',
                    'Hindi',
                    'Spanish',
                    'French',
                    'German',
                  ]
                      .map((lang) => SimpleDialogOption(
                            child: Text(lang),
                            onPressed: () {
                              setState(() => _language = lang);
                              Navigator.pop(context);
                            },
                          ))
                      .toList(),
                ),
              );
            },
          ),
          const Divider(height: 32),

          // Appearance
          _SectionHeader(title: 'Appearance'),
          SwitchListTile(
            secondary: const Icon(Icons.dark_mode, color: AppColors.primary),
            title: const Text('Dark Mode'),
            subtitle: const Text('Use dark theme'),
            value: _darkMode,
            onChanged: (value) => setState(() => _darkMode = value),
            activeColor: AppColors.accent,
          ),
          const Divider(height: 32),

          // Account Section
          _SectionHeader(title: 'Account'),
          _SettingsTile(
            icon: Icons.security,
            title: 'Change Password',
            subtitle: 'Update your password',
            onTap: () {},
          ),
          _SettingsTile(
            icon: Icons.download,
            title: 'Export Data',
            subtitle: 'Download your travel data',
            onTap: () {},
          ),
          _SettingsTile(
            icon: Icons.delete_outline,
            title: 'Delete Account',
            subtitle: 'Permanently delete your account',
            titleColor: AppColors.error,
            onTap: () {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Delete Account'),
                  content: const Text(
                    'This action cannot be undone. All your data including '
                    'trips, badges, and notes will be permanently deleted.',
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Cancel'),
                    ),
                    ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.error,
                      ),
                      child: const Text('Delete'),
                    ),
                  ],
                ),
              );
            },
          ),
          const SizedBox(height: 24),

          // App Info
          Center(
            child: Column(
              children: [
                Text(
                  'Partner v1.0.0',
                  style: TextStyle(
                    color: AppColors.textTertiary,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Travel Together. Explore Beyond.',
                  style: TextStyle(
                    color: AppColors.textTertiary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;

  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
      child: Text(
        title,
        style: Theme.of(context).textTheme.titleSmall?.copyWith(
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
            ),
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback? onTap;
  final Color? titleColor;

  const _SettingsTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    this.onTap,
    this.titleColor,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: titleColor ?? AppColors.primary),
      title: Text(
        title,
        style: TextStyle(color: titleColor),
      ),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 12)),
      trailing: const Icon(Icons.chevron_right, size: 20),
      onTap: onTap,
    );
  }
}
