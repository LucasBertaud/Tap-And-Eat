import { useAlert } from "@/src/hooks/use-alert";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QRScannerProps {
  visible: boolean;
  onClose: () => void;
  onScanned: (data: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({
  visible,
  onClose,
  onScanned,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { showAlert, AlertComponent } = useAlert();

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);
    onScanned(data);

    setTimeout(() => setScanned(false), 2000);
  };

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      showAlert({
        title: "Permission refusée",
        message: "L'accès à la caméra est nécessaire pour scanner les QR codes",
        type: "error",
        buttons: [{ text: "OK", style: "default" }],
      });
      onClose();
    }
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="camera-outline" size={64} color="#F97316" />
            </View>
            <Text style={styles.permissionTitle}>Accès à la caméra requis</Text>
            <Text style={styles.permissionText}>
              Nous avons besoin d&apos;accéder à votre caméra pour scanner le QR
              code de votre table
            </Text>
            <TouchableOpacity
              onPress={handleRequestPermission}
              style={styles.permissionButton}
              activeOpacity={0.8}
            >
              <Text style={styles.permissionButtonText}>
                Autoriser l&apos;accès
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              style={styles.cancelButton}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scanner le QR Code</Text>
          <View style={{ width: 40 }} />
        </View>

        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            <View style={styles.instructions}>
              <Text style={styles.instructionsText}>
                Placez le QR code dans le cadre
              </Text>
            </View>
          </View>
        </CameraView>
      </View>
      <AlertComponent />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#F97316",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  instructions: {
    marginTop: 40,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  instructionsText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  permissionContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    maxWidth: 400,
  },
  iconContainer: {
    backgroundColor: "#FEF3C7",
    borderRadius: 50,
    padding: 20,
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
  },
  permissionText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: "#F97316",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 16,
  },
});
