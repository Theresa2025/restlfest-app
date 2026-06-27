import { Text, Pressable, StyleSheet } from "react-native";

type PrimaryButtonProps = {
    title: string;
    onPress: () => void;
};

export default function PrimaryButton({
                                          title,
                                          onPress,
                                      }: PrimaryButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
            ]}
        >
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#3A7D44",
        paddingVertical: 15,
        paddingHorizontal: 18,
        borderRadius: 14,
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },

    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },

    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});