import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { fontFamilies, typeScale, colors, spacing } from '../design/tokens';

export function FontSmokeTestScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Font Smoke Test — Inter v4.1</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Regular (400)</Text>
          <Text style={{ fontFamily: fontFamilies.regular, fontSize: 18 }}>
            The quick brown fox jumps over the lazy dog
          </Text>
          <Text style={{ fontFamily: fontFamilies.regular, fontSize: 14 }}>
            0123456789 — ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Medium (500)</Text>
          <Text style={{ fontFamily: fontFamilies.medium, fontSize: 18 }}>
            The quick brown fox jumps over the lazy dog
          </Text>
          <Text style={{ fontFamily: fontFamilies.medium, fontSize: 14 }}>
            0123456789 — ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>SemiBold (600)</Text>
          <Text style={{ fontFamily: fontFamilies.semiBold, fontSize: 18 }}>
            The quick brown fox jumps over the lazy dog
          </Text>
          <Text style={{ fontFamily: fontFamilies.semiBold, fontSize: 14 }}>
            0123456789 — ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bold (700)</Text>
          <Text style={{ fontFamily: fontFamilies.bold, fontSize: 18 }}>
            The quick brown fox jumps over the lazy dog
          </Text>
          <Text style={{ fontFamily: fontFamilies.bold, fontSize: 14 }}>
            0123456789 — ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Type Scale Verification</Text>
          <Text style={[typeScale.display, { color: colors.text.primary }]}>Display</Text>
          <Text style={[typeScale.heading, { color: colors.text.primary }]}>Heading</Text>
          <Text style={[typeScale.subheading, { color: colors.text.primary }]}>Subheading</Text>
          <Text style={[typeScale.body, { color: colors.text.secondary }]}>Body regular</Text>
          <Text style={[typeScale.bodySmall, { color: colors.text.secondary }]}>Body small</Text>
          <Text style={[typeScale.caption, { color: colors.text.tertiary }]}>Caption</Text>
          <Text style={[typeScale.label, { color: colors.text.tertiary }]}>Label medium</Text>
          <Text style={[typeScale.overline, { color: colors.text.tertiary }]}>Overline uppercase</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Color Tokens (brand.primary = orange)</Text>
          <View style={{ width: 80, height: 40, backgroundColor: colors.brand.primary, borderRadius: 8 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.default,
  },
  scroll: {
    padding: spacing.lg,
  },
  header: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.surface.subtle,
    borderRadius: 8,
  },
  label: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 12,
    color: colors.brand.primary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
