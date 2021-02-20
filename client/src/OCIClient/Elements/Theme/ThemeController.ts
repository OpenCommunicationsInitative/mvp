import * as bjs from '@babylonjs/core/Legacy/legacy';
import { SceneElement } from '../../../SceneGraph/SceneElement';
import { Theme } from './Theme';
import { OCIClientScene } from '../../OCIClientScene';

export class ThemeController extends SceneElement
{
    themes : Array<Theme> = new Array<Theme>();
    activeTheme : Theme | undefined;
    activeThemeIndex : number = 0;
   
    constructor(public name:string,
                public x: number,
                public y: number,
                public z: number,
                public scene : OCIClientScene
                )
            {
                super(name,x,y,z,scene);
                this.create();
            }

    addTheme(name: string, theme : Theme)
    {
        theme.setEnabled(false);
        this.addChild(theme);
        this.themes.push(theme);
    }

    applyThemeByIndex(index : number)
    {

    }

    applyTheme(index : number)
    {
        if (index < this.themes.length)
        {
            let newTheme : Theme | undefined =  this.themes[index];
        
            if (newTheme)
            {
                if (this.activeTheme != undefined)
                {
                    if (this.activeTheme)
                    {
                        this.activeTheme.remove();
                    }           
                }

                this.activeTheme = newTheme;
                this.activeThemeIndex = index;
                this.activeTheme?.setEnabled(true);
                this.activeTheme?.apply();
            }
        }
    }

    public nextTheme() : void
    {
        if (this.activeThemeIndex < (this.themes.length - 1))
        {
            this.applyTheme(this.activeThemeIndex + 1);
        }
        else
        {
            this.applyTheme(0);
        }       
    }
 
    protected onCreate()
    {
       
    }

    protected onRender()
    {
       
    }
}