import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final localStorageProvider = Provider<LocalStorage>((ref) {
  return LocalStorage();
});

class LocalStorage {
  static const String _authBoxName = 'auth';
  static const String _cacheBoxName = 'cache';
  static const String _settingsBoxName = 'settings';

  static const String _accessTokenKey = 'access_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userDataKey = 'user_data';

  // Auth Token Methods

  Future<void> setAccessToken(String token) async {
    final box = await Hive.openBox(_authBoxName);
    await box.put(_accessTokenKey, token);
  }

  Future<String?> getAccessToken() async {
    final box = await Hive.openBox(_authBoxName);
    return box.get(_accessTokenKey) as String?;
  }

  Future<void> setRefreshToken(String token) async {
    final box = await Hive.openBox(_authBoxName);
    await box.put(_refreshTokenKey, token);
  }

  Future<String?> getRefreshToken() async {
    final box = await Hive.openBox(_authBoxName);
    return box.get(_refreshTokenKey) as String?;
  }

  Future<void> clearTokens() async {
    final box = await Hive.openBox(_authBoxName);
    await box.delete(_accessTokenKey);
    await box.delete(_refreshTokenKey);
  }

  // User Data Methods

  Future<void> setUserData(Map<String, dynamic> data) async {
    final box = await Hive.openBox(_authBoxName);
    await box.put(_userDataKey, data);
  }

  Future<Map<String, dynamic>?> getUserData() async {
    final box = await Hive.openBox(_authBoxName);
    final data = box.get(_userDataKey);
    if (data != null) {
      return Map<String, dynamic>.from(data as Map);
    }
    return null;
  }

  // Cache Methods

  Future<void> cacheData(String key, dynamic data) async {
    final box = await Hive.openBox(_cacheBoxName);
    await box.put(key, {
      'data': data,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
    });
  }

  Future<dynamic> getCachedData(String key, {Duration? maxAge}) async {
    final box = await Hive.openBox(_cacheBoxName);
    final cached = box.get(key);
    if (cached == null) return null;

    final map = Map<String, dynamic>.from(cached as Map);
    if (maxAge != null) {
      final timestamp = map['timestamp'] as int;
      final age = DateTime.now().millisecondsSinceEpoch - timestamp;
      if (age > maxAge.inMilliseconds) {
        await box.delete(key);
        return null;
      }
    }

    return map['data'];
  }

  Future<void> clearCache() async {
    final box = await Hive.openBox(_cacheBoxName);
    await box.clear();
  }

  // Settings Methods

  Future<void> setSetting(String key, dynamic value) async {
    final box = await Hive.openBox(_settingsBoxName);
    await box.put(key, value);
  }

  Future<dynamic> getSetting(String key, {dynamic defaultValue}) async {
    final box = await Hive.openBox(_settingsBoxName);
    return box.get(key, defaultValue: defaultValue);
  }

  // Clear All

  Future<void> clearAll() async {
    await Hive.deleteBoxFromDisk(_authBoxName);
    await Hive.deleteBoxFromDisk(_cacheBoxName);
    await Hive.deleteBoxFromDisk(_settingsBoxName);
  }
}
