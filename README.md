# Corronsac Adventures

## Docker

### CLI Usage

We provide a little script to use the stack easily.
It's name is, obviously, <code>stack.sh</code>.

#### Build the stack

The first time you'll clone this repository, you'll need to build the stack. You can do it simply with : 
```shell
./stack.sh build
```

#### Start the stack

Once the stack is built, you'll need to start it :

```shell
./stack.sh start
```

#### Stop the stack

If eventually you need to stop the stack, you can do it with :

```shell
./stack.sh stop
```

#### Connect to node container

In order to connect to the node's container, you'll need to type :
```shell
./stack.sh cli node
```

#### Rebuild the stack

If the stack evolves during development, you can rebuild the stack with :

```shell
./stack.sh rebuild
```

## First install

If you haven't done it yet, first build the stack using this command : 
```shell
./stack.sh build
```


You can connect to the front container using 
```shell
./stack.sh cli node
```


