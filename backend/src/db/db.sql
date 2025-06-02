CREATE DATABASE MP_CasosDB;
GO
USE MP_CasosDB;
GO

-- 2. Tabla Fiscalías
CREATE TABLE Fiscalías (
  FiscalíaID INT PRIMARY KEY IDENTITY(1,1),
  NombreFiscalía VARCHAR(200) NOT NULL
);
GO

-- 3. Tabla Fiscales
CREATE TABLE Fiscales (
  FiscalID INT PRIMARY KEY IDENTITY(1,1),
  Nombre VARCHAR(200) NOT NULL,
  FiscalíaID INT NOT NULL,
  CONSTRAINT FK_Fiscales_Fiscalías FOREIGN KEY (FiscalíaID)
    REFERENCES Fiscalías(FiscalíaID)
    ON DELETE NO ACTION
    ON UPDATE CASCADE
);
GO

-- 4. Tabla Casos
CREATE TABLE Casos (
  CasoID INT PRIMARY KEY IDENTITY(1,1),
  Descripcion VARCHAR(500) NOT NULL,
  FiscalAsignado INT NOT NULL,
  Estado VARCHAR(50) NOT NULL,
  FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
  FechaActualizacion DATETIME NULL,
  CONSTRAINT FK_Casos_Fiscales FOREIGN KEY (FiscalAsignado)
    REFERENCES Fiscales(FiscalID)
    ON DELETE NO ACTION
    ON UPDATE CASCADE
);
GO

-- 5. Tabla LogReasignaciones (CORREGIDA)
CREATE TABLE LogReasignaciones (
  LogID INT PRIMARY KEY IDENTITY(1,1),
  CasoID INT NOT NULL,
  FiscalAnterior INT NOT NULL,
  FiscalIntentado INT NOT NULL,
  FechaIntento DATETIME NOT NULL DEFAULT GETDATE(),
  Motivo VARCHAR(300) NULL,
  CONSTRAINT FK_Log_Casos FOREIGN KEY (CasoID)
    REFERENCES Casos(CasoID)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT FK_Log_FiscalAnterior FOREIGN KEY (FiscalAnterior)
    REFERENCES Fiscales(FiscalID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,  -- Corregido
  CONSTRAINT FK_Log_FiscalIntentado FOREIGN KEY (FiscalIntentado)
    REFERENCES Fiscales(FiscalID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION   -- Corregido
);
GO

-- Inserciones de ejemplo (ahora funcionarán)
INSERT INTO Fiscalías (NombreFiscalía) VALUES ('Fiscalía General');
INSERT INTO Fiscalías (NombreFiscalía) VALUES ('Fiscalía Interina');
INSERT INTO Fiscalías (NombreFiscalía) VALUES ('Fiscalía Departamental');
INSERT INTO Fiscales (Nombre, FiscalíaID) VALUES ('María López', 1);
INSERT INTO Fiscales (Nombre, FiscalíaID) VALUES ('Juan Ortega', 2);
INSERT INTO Fiscales (Nombre, FiscalíaID) VALUES ('Walter Orozco', 3);
GO