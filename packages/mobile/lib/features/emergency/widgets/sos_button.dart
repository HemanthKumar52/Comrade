import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';

class SOSButton extends StatefulWidget {
  final VoidCallback? onActivated;

  const SOSButton({super.key, this.onActivated});

  @override
  State<SOSButton> createState() => _SOSButtonState();
}

class _SOSButtonState extends State<SOSButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;
  bool _isPressed = false;
  bool _isActivated = false;
  double _holdProgress = 0.0;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.08).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  void _onLongPressStart(LongPressStartDetails details) {
    setState(() => _isPressed = true);
    _startHoldTimer();
  }

  void _onLongPressEnd(LongPressEndDetails details) {
    setState(() {
      _isPressed = false;
      if (!_isActivated) {
        _holdProgress = 0.0;
      }
    });
  }

  Future<void> _startHoldTimer() async {
    const totalDuration = 3000; // 3 seconds
    const step = 50; // ms per step
    const steps = totalDuration ~/ step;

    for (int i = 0; i <= steps; i++) {
      if (!_isPressed || _isActivated) return;
      await Future.delayed(const Duration(milliseconds: step));
      if (!mounted) return;
      setState(() {
        _holdProgress = i / steps;
      });
    }

    if (_isPressed && !_isActivated) {
      setState(() => _isActivated = true);
      HapticFeedback.heavyImpact();
      widget.onActivated?.call();
      _showActivatedDialog();
    }
  }

  void _showActivatedDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.emergency, color: AppColors.error),
            SizedBox(width: 8),
            Text('SOS Activated'),
          ],
        ),
        content: const Text(
          'Emergency contacts have been notified with your current location. '
          'Stay calm and stay where you are if possible.',
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _isActivated = false;
                _holdProgress = 0.0;
                _isPressed = false;
              });
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
            ),
            child: const Text('Cancel SOS'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _pulseAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _isPressed ? 0.95 : _pulseAnimation.value,
          child: GestureDetector(
            onLongPressStart: _onLongPressStart,
            onLongPressEnd: _onLongPressEnd,
            child: Container(
              width: 140,
              height: 140,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: AppColors.error.withValues(alpha: _isPressed ? 0.5 : 0.3),
                    blurRadius: _isPressed ? 30 : 20,
                    spreadRadius: _isPressed ? 5 : 2,
                  ),
                ],
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Progress ring
                  SizedBox(
                    width: 140,
                    height: 140,
                    child: CircularProgressIndicator(
                      value: _holdProgress,
                      strokeWidth: 6,
                      backgroundColor: AppColors.error.withValues(alpha: 0.2),
                      valueColor: const AlwaysStoppedAnimation(AppColors.white),
                    ),
                  ),
                  // Button
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          AppColors.error,
                          _isPressed
                              ? AppColors.error.withValues(alpha: 0.8)
                              : const Color(0xFFDC2626),
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      shape: BoxShape.circle,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          _isActivated ? Icons.check : Icons.emergency,
                          color: AppColors.white,
                          size: 36,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _isActivated ? 'ACTIVE' : 'SOS',
                          style: const TextStyle(
                            color: AppColors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 2,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
