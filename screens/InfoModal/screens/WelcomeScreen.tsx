import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Svg, { Polygon } from 'react-native-svg';
import { Text } from '../../../design/components';
import { ModalStackNavigationProp } from '../../../types';
import { colors } from '../../../design/tokens/colors';
import { fontFamilies, typeScale } from '../../../design/tokens/typography';
import { spacing } from '../../../design/tokens/spacing';
import { radius } from '../../../design/tokens/radius';

type Props = {
  navigation: ModalStackNavigationProp;
};

const FEATURES: { icon: React.ComponentProps<typeof Feather>['name']; label: string }[] = [
  { icon: 'pie-chart', label: 'Macros' },
  { icon: 'zap',       label: 'Training' },
  { icon: 'trending-up', label: 'Progress' },
];

const WelcomeScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.root}>
      <Svg style={styles.slash} viewBox="0 0 520 760" preserveAspectRatio="none">
        <Polygon points="0,0 285,0 445,760 135,760" fill={colors.accent.teal} />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Step indicator — centered */}
        <View style={styles.stepRow}>
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
        </View>

        {/* ── Top content ──────────────────────────────── */}
        <View style={styles.topContent}>
          <Text variant="overline" style={styles.eyebrow}>Welcome to</Text>
          <Text variant="display" style={styles.wordmark}>Hone</Text>
          <Text variant="body" style={styles.tagline}>
            Dial in your nutrition.{'\n'}Lock in your training.
          </Text>
        </View>

        {/* ── Bottom content ───────────────────────────── */}
        <View style={styles.bottomContent}>
          {/* Feature pills */}
          <View style={styles.pillRow}>
            {FEATURES.map(f => (
              <View key={f.label} style={styles.pill}>
                <Feather name={f.icon} size={20} color={colors.accent.aqua} />
                <Text variant="label" style={styles.pillLabel}>{f.label}</Text>
              </View>
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('BasicInfo')}
            activeOpacity={0.9}
          >
            <Text variant="body" style={styles.btnPrimaryText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.6}>
            <Text variant="bodySmall" style={styles.btnGhost}>Sign in to existing account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.brand.primaryDark,
  },

  // ── Slash ──────────────────────────────────────────────
  slash: {
    position: 'absolute',
    width: 520,
    height: 760,
    top: -170,
    left: -140,
  },

  // ── Layout ─────────────────────────────────────────────
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },

  stepRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingTop: spacing.md,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  stepDotActive: {
    backgroundColor: colors.accent.rose,
  },

  topContent: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  eyebrow: {
    ...typeScale.overline,
    color: colors.accent.aqua,
  },
  wordmark: {
    fontFamily: fontFamilies.bold,
    fontSize: 72,
    lineHeight: 72,
    letterSpacing: -3,
    color: colors.text.inverse,
  },
  tagline: {
    ...typeScale.body,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 26,
  },

  // ── Bottom ─────────────────────────────────────────────
  bottomContent: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },

  pillRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  pill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  pillLabel: {
    ...typeScale.label,
    color: colors.text.inverse,
  },

  btnPrimary: {
    backgroundColor: colors.text.inverse,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: colors.brand.primary,
  },

  btnGhost: {
    ...typeScale.bodySmall,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    paddingVertical: spacing.xs,
  },
});

export default WelcomeScreen;
