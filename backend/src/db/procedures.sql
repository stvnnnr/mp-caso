USE MP_CasosDB;
GO

-- 1) sp_registrar_caso
CREATE PROCEDURE sp_registrar_caso
  @descripcion VARCHAR(500),
  @fiscalAsignado INT,
  @estado VARCHAR(50)
AS
BEGIN
  SET NOCOUNT ON;
  INSERT INTO Casos (Descripcion, FiscalAsignado, Estado, FechaCreacion)
  VALUES (@descripcion, @fiscalAsignado, @estado, GETDATE());
END
GO

-- 2) sp_obtener_casos
CREATE PROCEDURE sp_obtener_casos
  @estado VARCHAR(50) = NULL
AS
BEGIN
  SET NOCOUNT ON;
  IF @estado IS NULL
    SELECT * FROM Casos;
  ELSE
    SELECT * FROM Casos WHERE Estado = @estado;
END
GO

-- 3) sp_asignar_caso
CREATE PROCEDURE sp_asignar_caso
  @casoId INT,
  @nuevoFiscal INT,
  @nuevaFiscalia INT
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @estadoActual VARCHAR(50);
  DECLARE @fiscalActual INT;
  DECLARE @fiscaliaActual INT;

  SELECT @estadoActual = Estado, @fiscalActual = FiscalAsignado
    FROM Casos WHERE CasoID = @casoId;

  SELECT @fiscaliaActual = FiscalíaID
    FROM Fiscales WHERE FiscalID = @fiscalActual;

  IF @estadoActual <> 'PENDIENTE'
  BEGIN
    RAISERROR ('El caso no está en estado PENDIENTE; no se puede reasignar.', 16, 1);
    RETURN;
  END

  IF @fiscaliaActual <> @nuevaFiscalia
  BEGIN
    INSERT INTO LogReasignaciones (CasoID, FiscalAnterior, FiscalIntentado, FechaIntento, Motivo)
    VALUES (@casoId, @fiscalActual, @nuevoFiscal, GETDATE(), 'Fiscalía no coincide');
    RETURN;
  END

  UPDATE Casos
    SET FiscalAsignado = @nuevoFiscal
    WHERE CasoID = @casoId;
END
GO

-- 4) sp_actualizar_estado
CREATE PROCEDURE sp_actualizar_estado
  @casoId INT,
  @nuevoEstado VARCHAR(50)
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE Casos
    SET Estado = @nuevoEstado,
        FechaActualizacion = GETDATE()
    WHERE CasoID = @casoId;
END
GO

-- 5) sp_generar_informe_estadistico
CREATE PROCEDURE sp_generar_informe_estadistico
AS
BEGIN
  SET NOCOUNT ON;
  SELECT Estado, COUNT(*) AS Cantidad
    FROM Casos
   GROUP BY Estado;
END
GO

-- 6) sp_obtener_fiscalias
CREATE PROCEDURE sp_obtener_fiscalias
AS
BEGIN
  SET NOCOUNT ON;
  SELECT
    FiscalíaID,
    NombreFiscalía
  FROM Fiscalías
  ORDER BY NombreFiscalía;
END
GO


-- 7) sp_obtener_fiscales
CREATE PROCEDURE sp_obtener_fiscales
AS
BEGIN
  SET NOCOUNT ON;
  SELECT
    f.FiscalID,
    f.Nombre,
    f.FiscalíaID
  FROM Fiscales AS f
  ORDER BY f.Nombre;
END
GO