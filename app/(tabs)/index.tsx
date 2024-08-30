import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const initialOffset = -200; //Valor inicial fuera de la pantalla en la parte superior

export default function App() {
  //Valor compartido para la animación de deslizamiento del título
  const offset = useSharedValue(initialOffset);

  //Valor compartido para la animación de opacidad del título
  const opacity = useSharedValue(1); //1 significa que es completamente visible

  //Valor compartido para la opacidad del fondo del gradiente
  const backgroundOpacity = useSharedValue(1); //Comienza con el fondo rosa visible

  //Estado para alternar el fondo y el color del botón
  const [colorAlternado, setColorAlternado] = React.useState(false);

  //Estado para alternar la visibilidad del texto
  const [textoVisible, setTextoVisible] = React.useState(true);

  //Estilo animado para el texto
  const animatedTextStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }], //Animación de deslizamiento vertical
      opacity: opacity.value, //Animación de desvanecimiento
    };
  });

  //Estilo animado para el fondo
  const backgroundAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value, //Cambia la opacidad del gradiente de fondo
    };
  });

  //Iniciar la animación del texto al cargar la pantalla
  React.useEffect(() => {
    if (textoVisible) {
      offset.value = withTiming(0, { duration: 1000 }); //Deslizar el texto hacia abajo
    }
  }, [textoVisible]);

  //Cambiar el color del fondo, desvanecer el texto o hacerlo reaparecer al presionar el botón
  const cambiarColorFondoYDesvanecerTexto = () => {
    //Alternar la opacidad del fondo
    backgroundOpacity.value = withTiming(0, { duration: 1000 }, () => {
      setColorAlternado(!colorAlternado); //Alternar el estado de color
      backgroundOpacity.value = withTiming(1, { duration: 1000 }); //Mostrar el nuevo color de fondo
    });

    //Alternar la visibilidad del texto
    if (textoVisible) {
      //Desvanecer el texto
      opacity.value = withTiming(0, { duration: 1000 }, () => {
        setTextoVisible(false); //Cambiar el estado después de la animación
      });
    } else {
      //Hacer que el texto vuelva a aparecer con deslizamiento
      setTextoVisible(true); //Cambiar el estado antes de la animación
      offset.value = initialOffset; //Volver a la posición inicial del texto fuera de la pantalla
      opacity.value = 1; //Restablecer la opacidad a 1
      offset.value = withTiming(0, { duration: 1000 }); //Deslizar el texto hacia abajo
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, backgroundAnimatedStyles]}>
        <LinearGradient
          colors={colorAlternado ? ['rgba(144,238,144,0.8)', 'transparent'] : ['rgba(255,182,193,0.8)', 'transparent']}
          style={styles.backgroundGradient}
        />
      </Animated.View>

      {textoVisible && (
        <Animated.View style={[styles.welcomeContainer, animatedTextStyles]}>
          <Text style={styles.welcomeText}>¡Bienvenido!</Text>
        </Animated.View>
      )}

      <TouchableOpacity onPress={cambiarColorFondoYDesvanecerTexto}>
        <LinearGradient
          colors={colorAlternado ? ['#a8e6a1', '#b8daba', '#c4e0c5'] : ['#fbc2eb', '#e8aeb1', '#e7a1a1']}
          style={styles.button}>
          <Text style={styles.text}>Iniciar</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  background: {
    ...StyleSheet.absoluteFillObject, //Abarca toda la pantalla
  },
  backgroundGradient: {
    flex: 1, //Para que el gradiente cubra todo el fondo
  },
  welcomeContainer: {
    position: 'absolute',
    top: 50,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 15,
    color: '#fff',
  },
});