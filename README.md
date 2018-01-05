# autosize for angular

- [autosize](https://github.com/jackmoore/autosize)

```ts
import { AutoSizeModule } from 'meepo-autosize';
@NgModule({
  imports: [
    AutoSizeModule
  ]
})
export class AppModule { }


```

```html
<autosize [(model)]="title"></autosize>
```

```ts
export class AppComponent implements OnInit {
  title = 'app';
}
```