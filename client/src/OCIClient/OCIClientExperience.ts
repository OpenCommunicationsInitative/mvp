import { Experience } from "../SceneGraph/Experience";
import { SceneManager } from "../SceneGraph/SceneManager";
import { ViewportPosition } from "../Enums";
import { OCIClientScene } from './OCIClientScene';

export class OciClientExperience extends Experience
{
    private scene : OCIClientScene;

    public assetsPath = [
        {type: 'mesh', name:'Font_Conthrax_New', url: '/', fileName: 'Font_Conthrax_New.babylon'}
    ];
    
    constructor(public title: string, public canvas: HTMLCanvasElement, public useVR: boolean)
    {
        super(title,canvas);
    }
    
    protected onLoad()
    {
     
    
        
        //const oneDollarPriceDivisionSetting = new PriceDivisionSetting(PriceDivision.OneDollar, 0, currency(1));
        //this.priceDivisionManager.addPriceDivisionSetting(PriceDivision.OneDollar, oneDollarPriceDivisionSetting);
        //this.link = null
    
        this.scene = new OCIClientScene("OCI/P Client",
                                        this.canvas);

        this.start();
    }

    start()
    {
        if (SceneManager.Instance.scenes.length === 1) 
        {
            if (SceneManager.Instance.scenes[0].title === "emptyScene") 
            {
                SceneManager.Instance.scenes.shift();
            }
        }

        if (SceneManager.Instance.scenes.length === 0)
        {
            this.AddScene(this.scene);
            SceneManager.Instance.LoadScene(this.scene, this.canvas, ViewportPosition.Full);
        }
    }
}
