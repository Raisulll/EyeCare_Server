-- DOCTOR APPOINTMENT CURSOR WITH EXCEPTION HANDLING
CREATE OR REPLACE PROCEDURE GET_DOCTOR_APPOINTMENTS(
  P_DOCTORID IN NUMBER,
  P_CURSOR OUT SYS_REFCURSOR
) AS
BEGIN
 
  OPEN P_CURSOR FOR
    SELECT
      A.APPOINTMENT_ID,
      A.APPOINTMENT_DATE,
      A.APPOINTMENT_TIME,
      A.APPOINTMENT_STATUS,
      P.PATIENT_NAME
    FROM
      APPOINTMENT A
      JOIN PATIENT P
      ON A.PATIENT_ID = P.PATIENT_ID
    WHERE
      A.DOCTOR_ID = P_DOCTORID
      AND A.APPOINTMENT_STATUS = 'Pending';
EXCEPTION
 
  WHEN NO_DATA_FOUND THEN
    RAISE_APPLICATION_ERROR(-20001, 'No pending appointments found for the given doctor.');

  WHEN TOO_MANY_ROWS THEN
    RAISE_APPLICATION_ERROR(-20002, 'Too many appointments found. Please check the data.');

  WHEN OTHERS THEN
    RAISE_APPLICATION_ERROR(-20003, 'An unexpected error occurred: '|| SQLERRM);
END;
/