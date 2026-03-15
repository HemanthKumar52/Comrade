import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

enum NotificationType {
  tripUpdate,
  partnerRequest,
  badgeUnlock,
  sosAlert,
  travelAdvisory,
  chatMessage,
  systemAnnouncement,
}

enum NotificationFilter {
  all,
  trips,
  social,
  safety,
  system,
}

class NotificationItem {
  final String id;
  final String title;
  final String body;
  final NotificationType type;
  final String timestamp;
  final bool isRead;
  final String? route;

  const NotificationItem({
    required this.id,
    required this.title,
    required this.body,
    required this.type,
    required this.timestamp,
    this.isRead = false,
    this.route,
  });

  NotificationItem copyWith({bool? isRead}) {
    return NotificationItem(
      id: id,
      title: title,
      body: body,
      type: type,
      timestamp: timestamp,
      isRead: isRead ?? this.isRead,
      route: route,
    );
  }
}

IconData _iconForType(NotificationType type) {
  switch (type) {
    case NotificationType.tripUpdate:
      return Icons.directions_car_rounded;
    case NotificationType.partnerRequest:
      return Icons.person_add_rounded;
    case NotificationType.badgeUnlock:
      return Icons.emoji_events_rounded;
    case NotificationType.sosAlert:
      return Icons.emergency_rounded;
    case NotificationType.travelAdvisory:
      return Icons.warning_amber_rounded;
    case NotificationType.chatMessage:
      return Icons.chat_bubble_rounded;
    case NotificationType.systemAnnouncement:
      return Icons.campaign_rounded;
  }
}

Color _colorForType(NotificationType type) {
  switch (type) {
    case NotificationType.tripUpdate:
      return AppColors.info;
    case NotificationType.partnerRequest:
      return AppColors.badgeSocial;
    case NotificationType.badgeUnlock:
      return AppColors.accent;
    case NotificationType.sosAlert:
      return AppColors.error;
    case NotificationType.travelAdvisory:
      return AppColors.warning;
    case NotificationType.chatMessage:
      return AppColors.badgeExplorer;
    case NotificationType.systemAnnouncement:
      return AppColors.primary;
  }
}

NotificationFilter _filterForType(NotificationType type) {
  switch (type) {
    case NotificationType.tripUpdate:
      return NotificationFilter.trips;
    case NotificationType.partnerRequest:
    case NotificationType.chatMessage:
      return NotificationFilter.social;
    case NotificationType.sosAlert:
    case NotificationType.travelAdvisory:
      return NotificationFilter.safety;
    case NotificationType.badgeUnlock:
    case NotificationType.systemAnnouncement:
      return NotificationFilter.system;
  }
}

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() =>
      _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  NotificationFilter _selectedFilter = NotificationFilter.all;
  bool _isRefreshing = false;

  final List<Map<String, dynamic>> _filters = [
    {'id': NotificationFilter.all, 'label': 'All', 'icon': Icons.notifications_rounded},
    {'id': NotificationFilter.trips, 'label': 'Trips', 'icon': Icons.directions_car_rounded},
    {'id': NotificationFilter.social, 'label': 'Social', 'icon': Icons.people_rounded},
    {'id': NotificationFilter.safety, 'label': 'Safety', 'icon': Icons.shield_rounded},
    {'id': NotificationFilter.system, 'label': 'System', 'icon': Icons.settings_rounded},
  ];

  late List<NotificationItem> _notifications;

  @override
  void initState() {
    super.initState();
    _notifications = _mockNotifications();
  }

  List<NotificationItem> _mockNotifications() {
    return [
      const NotificationItem(
        id: '1',
        title: 'Trip route updated',
        body: 'Your Mumbai → Goa trip route has been optimized. Save 45 min via the coastal highway.',
        type: NotificationType.tripUpdate,
        timestamp: '2 min ago',
        isRead: false,
        route: '/trips/1',
      ),
      const NotificationItem(
        id: '2',
        title: 'SOS Alert nearby',
        body: 'Road closure reported on NH48 near Pune. Detour recommended via Lonavala.',
        type: NotificationType.sosAlert,
        timestamp: '15 min ago',
        isRead: false,
        route: '/trips/1',
      ),
      const NotificationItem(
        id: '3',
        title: 'Alex Chen wants to connect',
        body: 'Alex Chen sent you a partner request. You share 4 common trips!',
        type: NotificationType.partnerRequest,
        timestamp: '1 hr ago',
        isRead: false,
        route: '/partners/1',
      ),
      const NotificationItem(
        id: '4',
        title: 'Badge unlocked: Road Warrior',
        body: 'Congratulations! You completed 10,000 km of road trips. Keep exploring!',
        type: NotificationType.badgeUnlock,
        timestamp: '3 hr ago',
        isRead: true,
        route: '/badges',
      ),
      const NotificationItem(
        id: '5',
        title: 'New message from Sara Patel',
        body: 'Hey! Are you still planning the Jaipur trip this weekend?',
        type: NotificationType.chatMessage,
        timestamp: '5 hr ago',
        isRead: true,
        route: '/chat/2',
      ),
      const NotificationItem(
        id: '6',
        title: 'Travel advisory: Heavy rain',
        body: 'Heavy rainfall expected in Western Ghats region over the next 48 hours. Drive safely.',
        type: NotificationType.travelAdvisory,
        timestamp: 'Yesterday',
        isRead: true,
        route: '/trips/1',
      ),
      const NotificationItem(
        id: '7',
        title: 'App update available',
        body: 'Partner v2.5 is here! New offline maps, improved route planning, and dark mode.',
        type: NotificationType.systemAnnouncement,
        timestamp: 'Yesterday',
        isRead: true,
      ),
      const NotificationItem(
        id: '8',
        title: 'Trip starts tomorrow!',
        body: 'Your Delhi → Jaipur trip begins tomorrow at 6:00 AM. All set?',
        type: NotificationType.tripUpdate,
        timestamp: '2 days ago',
        isRead: true,
        route: '/trips/2',
      ),
      const NotificationItem(
        id: '9',
        title: 'David Kim accepted your request',
        body: 'You and David Kim are now travel partners. Plan a trip together!',
        type: NotificationType.partnerRequest,
        timestamp: '2 days ago',
        isRead: true,
        route: '/partners/5',
      ),
      const NotificationItem(
        id: '10',
        title: 'Badge unlocked: Culture Seeker',
        body: 'You visited 5 heritage sites. Amazing cultural exploration!',
        type: NotificationType.badgeUnlock,
        timestamp: '3 days ago',
        isRead: true,
        route: '/badges',
      ),
    ];
  }

  List<NotificationItem> get _filteredNotifications {
    if (_selectedFilter == NotificationFilter.all) return _notifications;
    return _notifications
        .where((n) => _filterForType(n.type) == _selectedFilter)
        .toList();
  }

  int get _unreadCount => _notifications.where((n) => !n.isRead).length;

  void _markAllAsRead() {
    setState(() {
      _notifications = _notifications
          .map((n) => n.copyWith(isRead: true))
          .toList();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('All notifications marked as read'),
        behavior: SnackBarBehavior.floating,
        duration: Duration(seconds: 2),
      ),
    );
  }

  void _dismissNotification(String id) {
    setState(() {
      _notifications.removeWhere((n) => n.id == id);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Notification dismissed'),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
        action: SnackBarAction(
          label: 'Undo',
          onPressed: () {
            setState(() {
              _notifications = _mockNotifications();
            });
          },
        ),
      ),
    );
  }

  void _onNotificationTap(NotificationItem notification) {
    // Mark as read on tap
    setState(() {
      final index = _notifications.indexWhere((n) => n.id == notification.id);
      if (index != -1) {
        _notifications[index] = notification.copyWith(isRead: true);
      }
    });

    // Navigate if route is available
    if (notification.route != null) {
      context.push(notification.route!);
    }
  }

  Future<void> _onRefresh() async {
    setState(() => _isRefreshing = true);
    // Simulate network fetch
    await Future.delayed(const Duration(seconds: 1));
    setState(() {
      _notifications = _mockNotifications();
      _isRefreshing = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        actions: [
          if (_unreadCount > 0)
            TextButton.icon(
              onPressed: _markAllAsRead,
              icon: const Icon(Icons.done_all_rounded, size: 18),
              label: const Text('Read all'),
              style: TextButton.styleFrom(
                foregroundColor: AppColors.primary,
              ),
            ),
        ],
      ),
      body: Column(
        children: [
          // Filter Tabs
          SizedBox(
            height: 44,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _filters.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final filter = _filters[index];
                final filterId = filter['id'] as NotificationFilter;
                final isSelected = _selectedFilter == filterId;
                return ChoiceChip(
                  selected: isSelected,
                  onSelected: (_) =>
                      setState(() => _selectedFilter = filterId),
                  avatar: Icon(filter['icon'] as IconData, size: 16),
                  label: Text(filter['label'] as String),
                  selectedColor: AppColors.primary.withValues(alpha: 0.12),
                  labelStyle: TextStyle(
                    color: isSelected
                        ? AppColors.primary
                        : AppColors.textSecondary,
                    fontWeight:
                        isSelected ? FontWeight.w600 : FontWeight.w400,
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 8),

          // Notification List
          Expanded(
            child: _filteredNotifications.isEmpty
                ? _buildEmptyState()
                : RefreshIndicator(
                    onRefresh: _onRefresh,
                    color: AppColors.accent,
                    child: ListView.separated(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 8),
                      itemCount: _filteredNotifications.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                      itemBuilder: (context, index) {
                        final notification = _filteredNotifications[index];
                        return _NotificationTile(
                          notification: notification,
                          onTap: () => _onNotificationTap(notification),
                          onDismiss: () =>
                              _dismissNotification(notification.id),
                        );
                      },
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    String message;
    IconData icon;

    switch (_selectedFilter) {
      case NotificationFilter.all:
        message = 'No notifications yet';
        icon = Icons.notifications_off_rounded;
        break;
      case NotificationFilter.trips:
        message = 'No trip notifications';
        icon = Icons.directions_car_rounded;
        break;
      case NotificationFilter.social:
        message = 'No social notifications';
        icon = Icons.people_outline_rounded;
        break;
      case NotificationFilter.safety:
        message = 'No safety alerts';
        icon = Icons.shield_outlined;
        break;
      case NotificationFilter.system:
        message = 'No system notifications';
        icon = Icons.settings_rounded;
        break;
    }

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 64, color: AppColors.textTertiary),
          const SizedBox(height: 16),
          Text(
            message,
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'When you get notifications, they\'ll show up here.',
            style: TextStyle(
              color: AppColors.textTertiary,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}

class _NotificationTile extends StatelessWidget {
  final NotificationItem notification;
  final VoidCallback onTap;
  final VoidCallback onDismiss;

  const _NotificationTile({
    required this.notification,
    required this.onTap,
    required this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    final color = _colorForType(notification.type);
    final icon = _iconForType(notification.type);

    return Dismissible(
      key: Key(notification.id),
      direction: DismissDirection.endToStart,
      onDismissed: (_) => onDismiss(),
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(
          color: AppColors.error.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(
          Icons.delete_outline_rounded,
          color: AppColors.error,
        ),
      ),
      child: Card(
        margin: EdgeInsets.zero,
        color: notification.isRead
            ? AppColors.surface
            : AppColors.primary.withValues(alpha: 0.04),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(
            color: notification.isRead
                ? AppColors.border
                : AppColors.primary.withValues(alpha: 0.15),
          ),
        ),
        elevation: notification.isRead ? 0 : 1,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Icon
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, color: color, size: 20),
                ),
                const SizedBox(width: 12),

                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          // Unread dot
                          if (!notification.isRead) ...[
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: AppColors.info,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 6),
                          ],
                          Expanded(
                            child: Text(
                              notification.title,
                              style: TextStyle(
                                fontWeight: notification.isRead
                                    ? FontWeight.w500
                                    : FontWeight.w700,
                                fontSize: 14,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        notification.body,
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 13,
                          fontWeight: notification.isRead
                              ? FontWeight.w400
                              : FontWeight.w500,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        notification.timestamp,
                        style: TextStyle(
                          fontSize: 11,
                          color: AppColors.textTertiary,
                        ),
                      ),
                    ],
                  ),
                ),

                // Chevron for navigable notifications
                if (notification.route != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 10),
                    child: Icon(
                      Icons.chevron_right_rounded,
                      size: 20,
                      color: AppColors.textTertiary,
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
