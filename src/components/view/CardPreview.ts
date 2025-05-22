import { ensureElement } from "../../utils/utils";
import { CardMain } from "./CardMain";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class CardPreview extends CardMain {
    protected description: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(blockName, container, actions);

        this.description = ensureElement<HTMLElement>(`${blockName}__text`, container);
    }

    setDescription (value: string): void {
        this.setText(this.description, value);
    }

}