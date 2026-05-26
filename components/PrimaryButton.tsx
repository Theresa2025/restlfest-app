import { Text, Pressable, StyleSheet } from "react-native";

type PrimaryButtonProps = {
    title: string;
    onPress: () => void;
};

export default function PrimaryButton({ title, onPress }: PrimaryButtonProps) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#3A7D44",
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 14,
        alignItems: "center",
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});