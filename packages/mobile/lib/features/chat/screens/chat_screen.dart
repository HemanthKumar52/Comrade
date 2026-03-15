import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  bool _isLoading = false;

  final _conversations = [
    {
      'id': 'chat-1',
      'partnerName': 'Alex Chen',
      'partnerId': '1',
      'lastMessage': 'See you at the starting point tomorrow at 6 AM!',
      'timestamp': '2 min ago',
      'unreadCount': 3,
      'isOnline': true,
    },
    {
      'id': 'chat-2',
      'partnerName': 'Sara Patel',
      'partnerId': '2',
      'lastMessage': 'The route through Lonavala was amazing 🏔️',
      'timestamp': '15 min ago',
      'unreadCount': 1,
      'isOnline': true,
    },
    {
      'id': 'chat-3',
      'partnerName': 'Mike Johnson',
      'partnerId': '3',
      'lastMessage': 'Thanks for the restaurant recommendation!',
      'timestamp': '1 hr ago',
      'unreadCount': 0,
      'isOnline': false,
    },
    {
      'id': 'chat-4',
      'partnerName': 'Priya Sharma',
      'partnerId': '4',
      'lastMessage': 'Let me know when you plan the Jaipur trip.',
      'timestamp': '3 hrs ago',
      'unreadCount': 0,
      'isOnline': false,
    },
    {
      'id': 'chat-5',
      'partnerName': 'David Kim',
      'partnerId': '5',
      'lastMessage': 'I shared the trip photos in the group.',
      'timestamp': 'Yesterday',
      'unreadCount': 5,
      'isOnline': true,
    },
    {
      'id': 'chat-6',
      'partnerName': 'Emily Zhang',
      'partnerId': '6',
      'lastMessage': 'How was the coastal road?',
      'timestamp': 'Yesterday',
      'unreadCount': 0,
      'isOnline': false,
    },
  ];

  Future<void> _onRefresh() async {
    setState(() => _isLoading = true);
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Messages'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
        ],
      ),
      body: _conversations.isEmpty
          ? _buildEmptyState()
          : RefreshIndicator(
              onRefresh: _onRefresh,
              color: AppColors.primary,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(vertical: 8),
                itemCount: _conversations.length,
                separatorBuilder: (_, __) => const Divider(
                  height: 1,
                  indent: 80,
                  endIndent: 16,
                  color: AppColors.divider,
                ),
                itemBuilder: (context, index) {
                  final conversation = _conversations[index];
                  return _ConversationTile(
                    conversation: conversation,
                    onTap: () => context.push(
                      '/chat/${conversation['id']}',
                      extra: {
                        'partnerName': conversation['partnerName'],
                        'partnerId': conversation['partnerId'],
                        'isOnline': conversation['isOnline'],
                      },
                    ),
                  );
                },
              ),
            ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.chat_bubble_outline_rounded,
            size: 64,
            color: AppColors.textTertiary,
          ),
          const SizedBox(height: 16),
          Text(
            'No conversations yet',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Start chatting with your travel partners!',
            style: TextStyle(
              fontSize: 14,
              color: AppColors.textTertiary,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => context.push('/partners'),
            icon: const Icon(Icons.people_outline),
            label: const Text('Find Partners'),
          ),
        ],
      ),
    );
  }
}

class _ConversationTile extends StatelessWidget {
  final Map<String, dynamic> conversation;
  final VoidCallback onTap;

  const _ConversationTile({
    required this.conversation,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final name = conversation['partnerName'] as String;
    final lastMessage = conversation['lastMessage'] as String;
    final timestamp = conversation['timestamp'] as String;
    final unreadCount = conversation['unreadCount'] as int;
    final isOnline = conversation['isOnline'] as bool;
    final hasUnread = unreadCount > 0;

    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            // Avatar with online indicator
            Stack(
              children: [
                CircleAvatar(
                  radius: 26,
                  backgroundColor: AppColors.primary.withValues(alpha: 0.12),
                  child: Text(
                    name.split(' ').map((w) => w[0]).take(2).join(),
                    style: const TextStyle(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                    ),
                  ),
                ),
                if (isOnline)
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      width: 14,
                      height: 14,
                      decoration: BoxDecoration(
                        color: AppColors.success,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: AppColors.white,
                          width: 2,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(width: 14),

            // Name + message preview
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          name,
                          style: TextStyle(
                            fontWeight:
                                hasUnread ? FontWeight.w700 : FontWeight.w600,
                            fontSize: 15,
                            color: AppColors.textPrimary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        timestamp,
                        style: TextStyle(
                          fontSize: 12,
                          color: hasUnread
                              ? AppColors.primary
                              : AppColors.textTertiary,
                          fontWeight:
                              hasUnread ? FontWeight.w600 : FontWeight.w400,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          lastMessage,
                          style: TextStyle(
                            fontSize: 13,
                            color: hasUnread
                                ? AppColors.textPrimary
                                : AppColors.textSecondary,
                            fontWeight:
                                hasUnread ? FontWeight.w500 : FontWeight.w400,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (hasUnread) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 7,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            unreadCount > 9 ? '9+' : '$unreadCount',
                            style: const TextStyle(
                              color: AppColors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
