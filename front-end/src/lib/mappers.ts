export function mapChainToCompileEndpoint(selectedChain: string) {
  switch (selectedChain) {
    case 'Aurora':
    case 'Base':
    case 'Arbitrum':
    case 'Linea':
    case 'Celo':
    case 'Scroll':
    case 'Ethereum':
    case 'Zeta': {
      return 'solidity';
    }
    case 'Sway': {
      return 'fuel';
    }
    // TODO: Fix MongoDB typo - Should be MultiversX
    case 'Multiversx': {
      return 'multiversx';
    }
    default: {
      return 'solidity';
    }
  }
}

export function mapChainToFileExtension(selectedChain: string) {
  switch (selectedChain) {
    case 'Aurora':
    case 'Base':
    case 'Ethereum':
    case 'Zeta': {
      return 'sol';
    }
    case 'Sway': {
      return 'sw';
    }
    // TODO: Fix MongoDB typo - Should be MultiversX
    case 'Multiversx': {
      return 'rs';
    }
    default: {
      return '';
    }
  }
}
