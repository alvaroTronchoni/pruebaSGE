var cargarDB ={
    db:"",
    initialize: function(){
        //generamos el conector
        this.db = window.openDatabase("localDB","1.0","Base de datos de prueba",2*1024*1024);
        this.cargaDB();
    },
    cargaDB: function(){
        console.log("Cargar la base de datos;");
        //transaccion
        this.db.transaction(this.mostrarDB,this.mostrarDBerror);        
    },
    mostrarDB: function(tx){
        //Paso 4 - ordenamos las consultas mostrando primero los ultimos anyadidos
        var sql = "select * from usuarios order by ultimos desc";
        console.log("Lanzamos la consulta");
        tx.executeSql(sql,[],
            function(tx,result){
                console.log("Se ha producido la consulta con exito");
                if(result.rows.length>0){
                    for(var i = 0;i<result.rows.length;i++){
                        var fila = result.rows.item(i);
                        console.log("Row "+i+" nombre: "+fila.nombre);
                        $("#lista ul").append("<li><a href='Perfil.html' data-ajax='false'><img src='./img/logo3.png' width=80px heigth=80px>"+ fila.nombre+"</a></li>").listview('refresh');
                    }
                }
            },
            function(tx,error){
                this.mostrarDBerror;
            }
            );

            
    },
    mostrarDBerror: function(err){
        console.log("Se ha producido un error en la creacion de la base de datos: "+error.code);
    }

};

var confDB = {
    existe_db:null,
    db:"",
    initialize: function(){
        //variable existe db
        existe_db = window.localStorage.getItem("existe_db");
        //creamos el enlace con la base de datos
        this.db = window.openDatabase("localDB","1.0","Base de datos de prueba",2*1024*1024);
        //preguntamos si es necesario crear la base de datos
        if(existe_db==null){
            console.log("Creamos la base de datos");
            this.createDB();
        }else{
            console.log("Cargamos la base de datoos");
            cargarDB.initialize();
        }
    },

    createDB: function(){
        console.log("No existe la base de datos");
        window.localStorage.setItem("existe_db",1);

        this.db.transaction(this.createLocalDB,this.createDBError,this.createDBSucc);        
    },
    createLocalDB: function(tx){
        var sql="create table if not exists usuarios ("+
            "id integer primary key autoincrement,"+
            "nombre varchar(50),"+
            "apellidos varchar(256),"+
            "cargo varchar(128),"+
            "email varchar(64)," +
            //Paso 2 - crear un nuevo campo en la base de datos que solo puede ser entre 0 y 1
            "ultimos integer (1) CHECK (ultimos >= 0 and ultimos <= 1));";
        
        tx.executeSql(sql);

        //Paso 2 - no hace falta que pongamos valor real en el campo ultimos ya que luego se actualizara
        sql = "insert into usuarios(id,nombre,apellidos,cargo,email,ultimos)"+
        "values(null,'Alvaro','Tronchoni Aguilar','Alumno','alvaroroto@hotmail.coom',0);";
        tx.executeSql(sql);
        sql = "insert into usuarios(id,nombre,apellidos,cargo,email,ultimos)"+
        "values(null,'Robert','Villamayor Pastor','Alumno','robert_y_tal_y_cual@hotmail.coom',0);";
        tx.executeSql(sql);
        sql = "insert into usuarios(id,nombre,apellidos,cargo,email,ultimos)"+
        "values(null,'Julio','Llacer Gastaldo','Alumno','julito@hotmail.coom',0);";
        tx.executeSql(sql);
        //Paso 3 - para comprovar que el paso dos funciona anyadimos mas campos
        sql = "insert into usuarios(id,nombre,apellidos,cargo,email,ultimos)"+
        "values(null,'Jorge','Ombuena X','Alumno','alvaroroto@hotmail.coom',0);";
        tx.executeSql(sql);
        sql = "insert into usuarios(id,nombre,apellidos,cargo,email,ultimos)"+
        "values(null,'Pablo','Maganya Pastor','Alumno','robert_y_tal_y_cual@hotmail.coom',0);";
        tx.executeSql(sql);
        sql = "insert into usuarios(id,nombre,apellidos,cargo,email,ultimos)"+
        "values(null,'Manel','Andreu Gastaldo','Alumno','julito@hotmail.coom',0);";
        tx.executeSql(sql);

        //Paso 2 - actualizamos para que los tres datos anyadidos al final sean los que tengan el 1
        sql = "update usuarios set ultimos = 1 where id in(select id from usuarios order by id desc limit 3);";
        tx.executeSql(sql);


    },
    createDBError: function(err){
        console.log("Se ha producido un error en la creacion de la base de datos: "+error.code);
    },
    createDBSucc: function(){
        console.log("Se ha generado la base de datos con exito");
        window.localStorage.setItem("existe_db",1);
    }
};