import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';

class ChatDetailScreen extends ConsumerStatefulWidget {
  final String chatId;
  final String partnerName;
  final String partnerId;
  final bool isOnline;

  const ChatDetailScreen({
    super.key,
    required this.chatId,
    required this.partnerName,
    required this.partnerId,
    this.isOnline = false,
  });

  @override
  ConsumerState<ChatDetailScreen> createState() => _ChatDetailScreenState();
}

class _ChatDetailScreenState extends ConsumerState<ChatDetailScreen> {
  final _messageController = TextEditingController();
  final _scrollController = ScrollController();
  bool _isPartnerTyping = false;

  // Current user id for distinguishing sent vs received
  static const _currentUserId = 'me';

  final List<Map<String, dynamic>> _messages = [
    {
      'id': 'm1',
      'senderId': 'partner',
      'content': 'Hey! Are you ready for the Mumbai to Goa trip?',
      'timestamp': '10:00 AM',
      'date': 'Today',
    },
    {
      'id': 'm2',
      'senderId': 'me',
      'content': 'Absolutely! I have been looking forward to it all week.',
      'timestamp': '10:02 AM',
      'date': 'Today',
    },
    {
      'id': 'm3',
      'senderId': 'partner',
      'content':
          'Great! I found an amazing coastal route through Alibaug and Ratnagiri. The views should be incredible.',
      'timestamp': '10:03 AM',
      'date': 'Today',
    },
    {
      'id': 'm4',
      'senderId': 'me',
      'content':
          'That sounds perfect. Should we stop at Ganpatipule on the way?',
      'timestamp': '10:05 AM',
      'date': 'Today',
    },
    {
      'id': 'm5',
      'senderId': 'partner',
      'content': 'Definitely! The temple and beach there are worth a visit.',
      'timestamp': '10:06 AM',
      'date': 'Today',
    },
    {
      'id': 'm6',
      'senderId': 'me',
      'content': 'What time should we start tomorrow?',
      'timestamp': '10:10 AM',
      'date': 'Today',
    },
    {
      'id': 'm7',
      'senderId': 'partner',
      'content':
          'See you at the starting point tomorrow at 6 AM!',
      'timestamp': '10:12 AM',
      'date': 'Today',
    },
  ];

  @override
  void initState() {
    super.initState();
    // Simulate partner typing after a delay
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() => _isPartnerTyping = true);
        Future.delayed(const Duration(seconds: 2), () {
          if (mounted) {
            setState(() => _isPartnerTyping = false);
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({
        'id': 'm${_messages.length + 1}',
        'senderId': _currentUserId,
        'content': text,
        'timestamp': TimeOfDay.now().format(context),
        'date': 'Today',
      });
    });

    _messageController.clear();

    // Scroll to bottom
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });

    // Simulate partner typing response
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) setState(() => _isPartnerTyping = true);
    });
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() {
          _isPartnerTyping = false;
          _messages.add({
            'id': 'm${_messages.length + 1}',
            'senderId': 'partner',
            'content': 'Sounds good! Looking forward to it.',
            'timestamp': TimeOfDay.now().format(context),
            'date': 'Today',
          });
        });
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (_scrollController.hasClients) {
            _scrollController.animateTo(
              _scrollController.position.maxScrollExtent,
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeOut,
            );
          }
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0,
        title: Row(
          children: [
            Stack(
              children: [
                CircleAvatar(
                  radius: 18,
                  backgroundColor:
                      AppColors.primary.withValues(alpha: 0.12),
                  child: Text(
                    widget.partnerName
                        .split(' ')
                        .map((w) => w[0])
                        .take(2)
                        .join(),
                    style: const TextStyle(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                    ),
                  ),
                ),
                if (widget.isOnline)
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      width: 10,
                      height: 10,
                      decoration: BoxDecoration(
                        color: AppColors.success,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: AppColors.white,
                          width: 1.5,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.partnerName,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    _isPartnerTyping
                        ? 'typing...'
                        : widget.isOnline
                            ? 'Online'
                            : 'Last seen recently',
                    style: TextStyle(
                      fontSize: 12,
                      color: _isPartnerTyping
                          ? AppColors.success
                          : AppColors.textSecondary,
                      fontWeight: _isPartnerTyping
                          ? FontWeight.w500
                          : FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.call_outlined),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.more_vert),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Messages
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              itemCount: _messages.length + (_isPartnerTyping ? 1 : 0),
              itemBuilder: (context, index) {
                // Typing indicator as last item
                if (_isPartnerTyping && index == _messages.length) {
                  return _buildTypingIndicator();
                }

                final message = _messages[index];
                final isSent = message['senderId'] == _currentUserId;

                // Show date header if it is the first message or date changed
                final showDateHeader = index == 0 ||
                    _messages[index]['date'] != _messages[index - 1]['date'];

                return Column(
                  children: [
                    if (showDateHeader)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceVariant,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            message['date'] as String,
                            style: TextStyle(
                              fontSize: 12,
                              color: AppColors.textTertiary,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ),
                    _MessageBubble(
                      content: message['content'] as String,
                      timestamp: message['timestamp'] as String,
                      isSent: isSent,
                    ),
                  ],
                );
              },
            ),
          ),

          // Input bar
          _buildInputBar(),
        ],
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8, right: 80),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: AppColors.surfaceVariant,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(16),
            topRight: Radius.circular(16),
            bottomRight: Radius.circular(16),
            bottomLeft: Radius.circular(4),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _TypingDot(delay: 0),
            const SizedBox(width: 4),
            _TypingDot(delay: 150),
            const SizedBox(width: 4),
            _TypingDot(delay: 300),
          ],
        ),
      ),
    );
  }

  Widget _buildInputBar() {
    return Container(
      padding: EdgeInsets.fromLTRB(
        12,
        8,
        12,
        MediaQuery.of(context).viewPadding.bottom + 8,
      ),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(
          top: BorderSide(color: AppColors.divider, width: 1),
        ),
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline),
            color: AppColors.textSecondary,
            onPressed: () {},
          ),
          Expanded(
            child: TextField(
              controller: _messageController,
              textCapitalization: TextCapitalization.sentences,
              decoration: InputDecoration(
                hintText: 'Type a message...',
                hintStyle: TextStyle(color: AppColors.textTertiary),
                filled: true,
                fillColor: AppColors.surfaceVariant,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide.none,
                ),
              ),
              onSubmitted: (_) => _sendMessage(),
            ),
          ),
          const SizedBox(width: 8),
          Container(
            decoration: const BoxDecoration(
              color: AppColors.primary,
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: const Icon(Icons.send_rounded, size: 20),
              color: AppColors.white,
              onPressed: _sendMessage,
            ),
          ),
        ],
      ),
    );
  }
}

class _MessageBubble extends StatelessWidget {
  final String content;
  final String timestamp;
  final bool isSent;

  const _MessageBubble({
    required this.content,
    required this.timestamp,
    required this.isSent,
  });

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: isSent ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: EdgeInsets.only(
          bottom: 6,
          left: isSent ? 60 : 0,
          right: isSent ? 0 : 60,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: isSent ? AppColors.primary : AppColors.surfaceVariant,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: Radius.circular(isSent ? 16 : 4),
            bottomRight: Radius.circular(isSent ? 4 : 16),
          ),
        ),
        child: Column(
          crossAxisAlignment:
              isSent ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            Text(
              content,
              style: TextStyle(
                fontSize: 14,
                color: isSent ? AppColors.white : AppColors.textPrimary,
                height: 1.35,
              ),
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  timestamp,
                  style: TextStyle(
                    fontSize: 11,
                    color: isSent
                        ? AppColors.white.withValues(alpha: 0.7)
                        : AppColors.textTertiary,
                  ),
                ),
                if (isSent) ...[
                  const SizedBox(width: 4),
                  Icon(
                    Icons.done_all,
                    size: 14,
                    color: AppColors.white.withValues(alpha: 0.7),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _TypingDot extends StatefulWidget {
  final int delay;

  const _TypingDot({required this.delay});

  @override
  State<_TypingDot> createState() => _TypingDotState();
}

class _TypingDotState extends State<_TypingDot>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _animation = Tween<double>(begin: 0.3, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );

    Future.delayed(Duration(milliseconds: widget.delay), () {
      if (mounted) {
        _controller.repeat(reverse: true);
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Opacity(
          opacity: _animation.value,
          child: Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: AppColors.textTertiary,
              shape: BoxShape.circle,
            ),
          ),
        );
      },
    );
  }
}
