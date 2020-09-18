import { Component } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import { AudioService } from 'services/audio';
import { Inject } from 'services/core/injector';
import MixerItem from 'components/MixerItem.vue';
import { $t } from 'services/i18n';
import { Menu } from 'util/menus/Menu';
import { EditorCommandsService } from 'services/editor-commands';
import BaseElement from './BaseElement';
import Scrollable from 'components/shared/Scrollable';

@Component({})
export default class Mixer extends BaseElement {
  @Inject() audioService: AudioService;
  @Inject() editorCommandsService: EditorCommandsService;

  mins = { x: 150, y: 120 };

  advancedSettingsTooltip = $t('Open advanced audio settings');
  mixerTooltip = $t('Monitor audio levels. If the bars are moving you are outputting audio.');
  audioDisplayOrder: string[] = null;

  mounted() {
    this.audioDisplayOrder = Object.keys(this.audioSources);
  }

  showAdvancedSettings() {
    this.audioService.showAdvancedSettings();
  }

  handleRightClick() {
    const menu = new Menu();
    menu.append({
      label: $t('Unhide All'),
      click: () => this.editorCommandsService.executeCommand('UnhideMixerSourcesCommand'),
    });
    menu.popup();
  }

  get audioSources() {
    return this.audioService.views.sourcesForCurrentScene;
  }

  get mixerList() {
    return this.audioDisplayOrder.map(sourceId => {
      const audioSource = this.audioSources[sourceId];
      if (audioSource.mixerHidden) return null;
      return <MixerItem audioSource={audioSource} key={sourceId} />;
    });
  }

  get element() {
    return (
      <div onContextmenu={() => this.handleRightClick()}>
        <div class="studio-controls-top">
          <h2
            class="studio-controls__label"
            v-tooltip={{ content: this.mixerTooltip, placement: 'bottom' }}
          >
            {$t('Mixer')}
          </h2>
          <div>
            <i
              class="icon-settings icon-button"
              onClick={() => this.showAdvancedSettings()}
              v-tooltip={{ content: this.advancedSettingsTooltip, placement: 'left' }}
            />
          </div>
        </div>
        <Scrollable className="studio-controls-selector mixer-panel">
          <Draggable vModel={this.audioDisplayOrder}>{this.mixerList}</Draggable>
        </Scrollable>
      </div>
    );
  }

  render() {
    return this.renderElement();
  }
}
