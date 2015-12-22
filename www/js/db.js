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
        //ORDER BY ultimos ASC
        var sql = "select * from usuarios";
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
            "email varchar(64));";
        
        tx.executeSql(sql);

        sql = "insert into usuarios(id,nombre,apellidos,cargo,email)"+
        "values(null,'Alvaro','Tronchoni Aguilar','Alumno','alvaroroto@hotmail.coom');";
        tx.executeSql(sql);
        sql = "insert into usuarios(id,nombre,apellidos,cargo,email)"+
        "values(null,'Robert','Villamayor Pastor','Alumno','robert_y_tal_y_cual@hotmail.coom');";
        tx.executeSql(sql);
        sql = "insert into usuarios(id,nombre,apellidos,cargo,email)"+
        "values(null,'Julio','Llacer Gastaldo','Alumno','julito@hotmail.coom');";
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