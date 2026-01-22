import {makeAutoObservable} from 'mobx';

interface IButton {
  text: string;
  action: () => void;
  type?: 'regular' | 'danger' | 'secondary';
}

class PopupStore {
  constructor() {
    makeAutoObservable(this);
  }

  isVisible = false;
  type: 'info' | 'error' | 'success' = 'info';
  title: string | undefined = '';
  description: string | undefined = '';
  buttons: IButton[] | undefined = [];

  showPopup(
    type: 'info' | 'error' | 'success',
    title: string,
    description?: string,
    buttons?: IButton[],
  ) {
    this.isVisible = true;
    this.type = type;
    this.title = title;
    this.description = description;
    this.buttons = buttons;
  }

  hidePopup() {
    this.isVisible = false;
  }
}

const popupStore = new PopupStore();
export default popupStore;