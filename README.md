# ts-util-721

1. ## Functional Programming
   1. ### Either
      Use *left(l: L)* or *right(r: R)* static functions in **Either** class to create Either for erroneous and valid values correspondingly.
      ```
      export class HttpsError{
        constructor(private message: string) {
        }
      
        get getError(){
            return this.message
        }
      }  
      ```
      ```
      export class HttpsResponse{
        constructor(public response: any) {
        }
      }  
      ```
      
      ```
      import axios from "axios";
      import {Either} from "ts-util-721";
      export class AxiosDatasource{
            ...
        async get(): Promise<Either<RestResponseFailure, RestResponse>> {
            try{
                const response = awiat this.axios.get(this.url)
                return Either.right(new HttpsResponse(response))
            }catch(error){
                return Either.left(new HttpsError(error.message))
            }
        }  
      }
      ```
      The result of the above function(Either type) can be consumed using functions of the Either instance; *fold*, *foldLeft*, *foldRight*, *getOrElse*, *getLeft* or *getRight*.
      ```
      import {AxiosDatasource} from "./axios_datasource"
      
      const someFunction = () => {
         const response = await new AxiosDatasource().get()
         response.fold(async l => {
            // Display or log error using l.getError
         }, async r => {
            // Consume valid value using r.response
         })        
      ```
   2. ### Option
      You can use option similar to the Either  
      You can use *Option.none()* and *Option.some()* to create Option object.   
      Similar functions to consume the value of an Option is also present here.
   
2. ## Dependency Injection
   You can register all your instances globally using the **DependencyProvider** class. You can register both singletons and lazy singletons.
   The provider class is a singleton on its own. It has a *getInstance* static function for instantiation, 
   but you won't have to use it because it is instantiated internally. You just need to import that.
   ```
   import {provider} from "ts-util-721"
   
   provider.registerSingleton(
        "unique indentifier",
         new AxiosDatasource()
   )
   
   provider.registerLazySingleton(
        "unique indentifier",
        () => new AxiosDatasource()
   )   
   ```
   The first usage is better suited for instances that are more likely to be used or are necessary during instantiation.
   The second usage is better for instances that may not be needed during the lifecycle of the application or are not need during instantiation.
   You can fetch the instance using the *get* function.
   ```
   import {provider} from "ts-util-721"
   
   const axiosDatasource = provider.get<AxiosDatasource>("unique indentifier")
   ```
   You should specify the type of the instance you are fetching if you read values of the instance since it can't induce the type of the instance automatically.
