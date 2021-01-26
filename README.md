# React usePersistedState

Tento projekt obsahuje soubor [src/usePersistedState.js](https://github.com/Czechitas-podklady-WEB/React-usePersistedState/blob/main/src/usePersistedState.js) s funkcí, která obaluje klasický `useState` v Reactu. `usePersistedState` navíc průběžně ukládá stav do [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), aby se **pamatoval i při znovunačtení stránky**. Soubor si můžete nakopírovat do svého projektu.

React hook `usePersistedState` má dva parametry. První je stejný jako u `useState`, nastavuje počáteční hodnotu. Druhý parametr se používá jako klíč pro uložení do `localStorage`.

Pro ukázku použití prozkoumejte soubor [src/Pocitadlo.jsx](https://github.com/Czechitas-podklady-WEB/React-usePersistedState/blob/main/src/Pocitadlo.jsx) a [src/Ukoly.jsx](https://github.com/Czechitas-podklady-WEB/React-usePersistedState/blob/main/src/Ukoly.jsx). Pro demonstraci je komponenta `<Ukoly />` na stránce dvakrát, aby bylo vidět, že všechny `usePersistedState` se stejným klíčem stav sdílí. Dokonce i napříč více otevřenými taby.

Ukázka chování komponent s `usePersistedState` je zde https://usepersistedstate.netlify.app/. Zkuste si přes tlačítka změnit stav počítadla nebo přidat nějaký úkol do seznamu. Vyzkoušejte stránku znovu načíst. Všimněte si, že komponenty si stav pamatují i po novém načtení. Všiměte si také, že komponenty se mění i v ostatních tabech, pokud máte stránku otevřenou víckrát.

```jsx
import { usePersistedState } from './usePersistedState'

const MojeKomponenta = () => {
	const [stav, setStav] = usePersistedState(
		'počáteční stav',
		'moje-komponenta', // Klíč pro uložení stavu do localStorage
	)

	return (
		<section>
			<h1>{stav}</h1>
			<div>Zde by bylo třeba tlačítko, které stav mění</div>
		</section>
	)
}
```

Kód je k dispozici i jako balíček. [npmjs.com/package/use-storage-backed-state](https://www.npmjs.com/package/use-storage-backed-state)
