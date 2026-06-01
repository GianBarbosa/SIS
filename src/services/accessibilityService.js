import {
  accessibilityRepository
} from '../repositories/accessibilityRepository';

export const accessibilityService = {

  iniciar: () => {

    accessibilityRepository
      .initAccessibilityTable();

  },

  obterConfiguracoes: () => {

    return accessibilityRepository
      .getAccessibility();

  },

  aumentarFonte: () => {

    const config =
      accessibilityRepository
        .getAccessibility();

    let novoTamanho =
      config.fontSize + 4;

    if (novoTamanho > 40) {
      novoTamanho = 40;
    }

    accessibilityRepository
      .updateFontSize(
        novoTamanho
      );

    return novoTamanho;

  },

  diminuirFonte: () => {

    const config =
      accessibilityRepository
        .getAccessibility();

    let novoTamanho =
      config.fontSize - 4;

    if (novoTamanho < 16) {
      novoTamanho = 16;
    }

    accessibilityRepository
      .updateFontSize(
        novoTamanho
      );

    return novoTamanho;

  },

  alternarContraste: () => {

    const config =
      accessibilityRepository
        .getAccessibility();

    const novoContraste =
      config.contrast === 1
        ? 0
        : 1;

    accessibilityRepository
      .updateContrast(
        novoContraste
      );

    return novoContraste;

  }

};