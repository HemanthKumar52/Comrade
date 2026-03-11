import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

class NotesScreen extends ConsumerStatefulWidget {
  const NotesScreen({super.key});

  @override
  ConsumerState<NotesScreen> createState() => _NotesScreenState();
}

class _NotesScreenState extends ConsumerState<NotesScreen> {
  String _selectedType = 'all';

  final _types = [
    {'id': 'all', 'label': 'All', 'icon': Icons.notes},
    {'id': 'text', 'label': 'Text', 'icon': Icons.text_snippet},
    {'id': 'photo', 'label': 'Photo', 'icon': Icons.photo_camera},
    {'id': 'voice', 'label': 'Voice', 'icon': Icons.mic},
    {'id': 'checklist', 'label': 'Checklist', 'icon': Icons.checklist},
  ];

  final _notes = [
    {
      'id': '1',
      'title': 'Amazing coastal road!',
      'content': 'The NH66 stretch between Mumbai and Goa was breathtaking. Must stop at Ganpatipule temple.',
      'type': 'text',
      'trip': 'Mumbai → Goa',
      'date': 'Mar 6, 2026',
      'color': AppColors.info,
    },
    {
      'id': '2',
      'title': 'Best food stops',
      'content': 'Konkan Rasoi - amazing fish thali. Highway Dhaba near Kolhapur - great mutton.',
      'type': 'text',
      'trip': 'Mumbai → Goa',
      'date': 'Mar 7, 2026',
      'color': AppColors.accent,
    },
    {
      'id': '3',
      'title': 'Sunset at Calangute',
      'content': '',
      'type': 'photo',
      'trip': 'Mumbai → Goa',
      'date': 'Mar 8, 2026',
      'color': AppColors.badgeSocial,
    },
    {
      'id': '4',
      'title': 'Packing list for Jaipur',
      'content': 'Sunscreen, hat, comfortable shoes, camera, power bank',
      'type': 'checklist',
      'trip': 'Delhi → Jaipur',
      'date': 'Feb 27, 2026',
      'color': AppColors.success,
    },
    {
      'id': '5',
      'title': 'Voice memo - route tips',
      'content': '0:45',
      'type': 'voice',
      'trip': 'Bangalore → Ooty',
      'date': 'Feb 20, 2026',
      'color': AppColors.badgeCulture,
    },
  ];

  List<Map<String, dynamic>> get _filteredNotes {
    if (_selectedType == 'all') return _notes;
    return _notes.where((n) => n['type'] == _selectedType).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Travel Notes'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Type Filters
          SizedBox(
            height: 44,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _types.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final type = _types[index];
                final isSelected = _selectedType == type['id'];
                return ChoiceChip(
                  selected: isSelected,
                  onSelected: (_) =>
                      setState(() => _selectedType = type['id'] as String),
                  avatar: Icon(type['icon'] as IconData, size: 16),
                  label: Text(type['label'] as String),
                  selectedColor: AppColors.primary.withValues(alpha: 0.12),
                );
              },
            ),
          ),
          const SizedBox(height: 12),

          // Notes List
          Expanded(
            child: _filteredNotes.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.note_add,
                            size: 64, color: AppColors.textTertiary),
                        const SizedBox(height: 16),
                        Text(
                          'No notes yet',
                          style: TextStyle(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _filteredNotes.length,
                    itemBuilder: (context, index) {
                      final note = _filteredNotes[index];
                      return _NoteCard(note: note);
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _showCreateNoteSheet(context);
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showCreateNoteSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.fromLTRB(
            24, 24, 24, MediaQuery.of(context).viewInsets.bottom + 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'New Note',
              style: Theme.of(context)
                  .textTheme
                  .titleLarge
                  ?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 16),
            const TextField(
              decoration: InputDecoration(
                hintText: 'Title',
              ),
            ),
            const SizedBox(height: 12),
            const TextField(
              maxLines: 4,
              decoration: InputDecoration(
                hintText: 'Write your note...',
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                IconButton(
                  onPressed: () {},
                  icon: const Icon(Icons.photo_camera),
                  color: AppColors.primary,
                ),
                IconButton(
                  onPressed: () {},
                  icon: const Icon(Icons.mic),
                  color: AppColors.primary,
                ),
                IconButton(
                  onPressed: () {},
                  icon: const Icon(Icons.checklist),
                  color: AppColors.primary,
                ),
                const Spacer(),
                ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Save'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _NoteCard extends StatelessWidget {
  final Map<String, dynamic> note;

  const _NoteCard({required this.note});

  @override
  Widget build(BuildContext context) {
    final color = note['color'] as Color;
    final type = note['type'] as String;

    IconData typeIcon;
    switch (type) {
      case 'photo':
        typeIcon = Icons.photo_camera;
        break;
      case 'voice':
        typeIcon = Icons.mic;
        break;
      case 'checklist':
        typeIcon = Icons.checklist;
        break;
      default:
        typeIcon = Icons.text_snippet;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(typeIcon, color: color, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    note['title'] as String,
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 15,
                    ),
                  ),
                  if ((note['content'] as String).isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      note['content'] as String,
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 13,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Icon(Icons.directions_car,
                          size: 12, color: AppColors.textTertiary),
                      const SizedBox(width: 4),
                      Text(
                        note['trip'] as String,
                        style: TextStyle(
                          fontSize: 11,
                          color: AppColors.textTertiary,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        note['date'] as String,
                        style: TextStyle(
                          fontSize: 11,
                          color: AppColors.textTertiary,
                        ),
                      ),
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
