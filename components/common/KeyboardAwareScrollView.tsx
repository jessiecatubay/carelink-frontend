import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  findNodeHandle,
  Keyboard,
  KeyboardEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  TargetedEvent,
  TextInput,
  UIManager,
} from "react-native";

export type KeyboardAwareScrollViewProps = ScrollViewProps & {
  /**
   * Extra spacing (in pixels) to leave between the focused input and the keyboard.
   * Defaults to 64.
   */
  extraScrollHeight?: number;
  /**
   * Whether to automatically scroll to the focused input when the keyboard appears.
   * Defaults to true.
   */
  enableAutomaticScroll?: boolean;
};

export type KeyboardAwareScrollViewRef = ScrollView & {
  scrollToFocusedInput: (targetNode?: any, additionalOffset?: number) => void;
};

const KeyboardAwareScrollView = forwardRef<
  KeyboardAwareScrollViewRef,
  KeyboardAwareScrollViewProps
>(
  (
    {
      children,
      contentContainerStyle,
      extraScrollHeight = 64,
      enableAutomaticScroll = true,
      keyboardShouldPersistTaps = "handled",
      keyboardDismissMode = "on-drag",
      showsVerticalScrollIndicator = false,
      onFocus,
      onScroll,
      scrollEventThrottle = 16,
      ...restProps
    },
    ref
  ) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const activeInputRef = useRef<any>(null);
    const currentScrollYRef = useRef<number>(0);
    const keyboardHeightRef = useRef<number>(0);
    const keyboardScreenYRef = useRef<number>(0);
    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    const clearTimers = () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };

    const scrollToActiveInput = useCallback(
      (node?: any, offset?: number) => {
        if (!enableAutomaticScroll) return;

        const target =
          node ||
          activeInputRef.current ||
          (TextInput as any).State?.currentlyFocusedInput?.();

        if (!target || !scrollViewRef.current) return;

        const additionalOffset = offset ?? extraScrollHeight;

        const adjustScrollForInputRect = (inputY: number, inputHeight: number) => {
          if (!scrollViewRef.current) return;

          (scrollViewRef.current as any)?.measureInWindow(
            (_scrollX: number, scrollY: number, _scrollWidth: number, scrollHeight: number) => {
              if (scrollHeight <= 0) return;

              const windowHeight = Dimensions.get("window").height;
              const keyboardTop =
                keyboardScreenYRef.current > 0
                  ? keyboardScreenYRef.current
                  : windowHeight - (keyboardHeightRef.current || 0);

              // Top of keyboard or bottom of scroll view, whichever is higher
              const visibleBottom =
                Math.min(scrollY + scrollHeight, keyboardTop) - additionalOffset;

              const inputBottom = inputY + inputHeight;

              if (inputBottom > visibleBottom) {
                const overlap = inputBottom - visibleBottom;
                const nextScrollY = currentScrollYRef.current + overlap;
                scrollViewRef.current?.scrollTo({
                  y: Math.max(0, nextScrollY),
                  animated: true,
                });
              } else if (inputY < scrollY + 8) {
                // Input is scrolled above visible ScrollView viewport
                const diff = scrollY + 8 - inputY;
                const nextScrollY = currentScrollYRef.current - diff;
                scrollViewRef.current?.scrollTo({
                  y: Math.max(0, nextScrollY),
                  animated: true,
                });
              }
            }
          );
        };

        // 1. Try measuring using measureInWindow on the component instance (Fabric or Paper)
        if (typeof target.measureInWindow === "function") {
          try {
            target.measureInWindow(
              (_x: number, y: number, _width: number, height: number) => {
                if (height > 0 || y > 0) {
                  adjustScrollForInputRect(y, height);
                }
              }
            );
            return;
          } catch {}
        }

        // 2. Try UIManager.measureInWindow if target is a numeric react tag
        if (typeof target === "number" && (UIManager as any).measureInWindow) {
          try {
            (UIManager as any).measureInWindow(
              target,
              (_x: number, y: number, _width: number, height: number) => {
                if (height > 0 || y > 0) {
                  adjustScrollForInputRect(y, height);
                }
              }
            );
            return;
          } catch {}
        }

        // 3. Fallback to native scrollResponder method
        try {
          let resolvedNode = target;
          if (
            typeof resolvedNode !== "number" &&
            typeof resolvedNode.measureLayout !== "function"
          ) {
            resolvedNode = findNodeHandle(resolvedNode) || resolvedNode;
          }
          scrollViewRef.current.scrollResponderScrollNativeHandleToKeyboard(
            resolvedNode,
            additionalOffset,
            true
          );
        } catch {}
      },
      [enableAutomaticScroll, extraScrollHeight]
    );

    // Forward all ScrollView methods to outer ref
    useImperativeHandle(ref, () => {
      const scrollInstance = scrollViewRef.current;
      return Object.assign(scrollInstance || ({} as any), {
        scrollToFocusedInput: scrollToActiveInput,
      });
    }, [scrollToActiveInput]);

    useEffect(() => {
      const scheduleScroll = () => {
        clearTimers();
        const t1 = setTimeout(
          () => {
            scrollToActiveInput();
          },
          Platform.OS === "ios" ? 60 : 80
        );
        const t2 = setTimeout(
          () => {
            scrollToActiveInput();
          },
          Platform.OS === "ios" ? 260 : 220
        );
        timersRef.current.push(t1, t2);
      };

      const onKeyboardShow = (e: KeyboardEvent) => {
        const height = e.endCoordinates.height;
        keyboardHeightRef.current = height;
        keyboardScreenYRef.current = e.endCoordinates.screenY;
        setKeyboardHeight(height);
        scheduleScroll();
      };

      const onKeyboardHide = () => {
        clearTimers();
        keyboardHeightRef.current = 0;
        keyboardScreenYRef.current = 0;
        setKeyboardHeight(0);
        activeInputRef.current = null;
      };

      const showSubscription = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
        onKeyboardShow
      );
      const hideSubscription = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
        onKeyboardHide
      );

      return () => {
        clearTimers();
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, [scrollToActiveInput]);

    const handleFocus = useCallback(
      (event: NativeSyntheticEvent<TargetedEvent>) => {
        activeInputRef.current =
          event.target || (TextInput as any).State?.currentlyFocusedInput?.();

        if (keyboardHeightRef.current > 0) {
          // Keyboard is already open (user switched between inputs)
          const delay = Platform.OS === "ios" ? 30 : 60;
          const t = setTimeout(() => {
            scrollToActiveInput(activeInputRef.current);
          }, delay);
          timersRef.current.push(t);
        }

        onFocus?.(event);
      },
      [onFocus, scrollToActiveInput]
    );

    const handleScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        currentScrollYRef.current = event.nativeEvent.contentOffset.y;
        onScroll?.(event);
      },
      [onScroll]
    );

    // Flatten contentContainerStyle and add dynamic bottom padding when keyboard is open
    const flattenedContainerStyle =
      StyleSheet.flatten(contentContainerStyle) || {};
    const basePaddingBottom =
      typeof flattenedContainerStyle.paddingBottom === "number"
        ? flattenedContainerStyle.paddingBottom
        : 20;

    const dynamicContentContainerStyle = {
      ...flattenedContainerStyle,
      flexGrow: flattenedContainerStyle.flexGrow ?? 1,
      paddingBottom:
        keyboardHeight > 0
          ? basePaddingBottom + keyboardHeight + extraScrollHeight
          : basePaddingBottom,
    };

    return (
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={dynamicContentContainerStyle}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyboardDismissMode={keyboardDismissMode}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        onFocus={handleFocus}
        onScroll={handleScroll}
        scrollEventThrottle={scrollEventThrottle}
        {...restProps}
      >
        {children}
      </ScrollView>
    );
  }
);

KeyboardAwareScrollView.displayName = "KeyboardAwareScrollView";

export default KeyboardAwareScrollView;
