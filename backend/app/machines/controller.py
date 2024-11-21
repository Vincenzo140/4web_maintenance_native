import time
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, FastAPI
from dependency_injector.wiring import inject, Provide
from fastapi.responses import JSONResponse
from google.oauth2 import id_token
from google.auth.transport import requests

from app.machines.schemas import CreateMachinesSchema, UpdateMachinesSchema
from app.machines.use_cases.create_machines_use_case import CreateMachineUseCase
from app.machines.use_cases.delete_machines_use_case import DeleteMachineUseCase
from app.machines.use_cases.get_all_machines_use_case import GetAllMachineUseCase 
from app.machines.use_cases.get_machines_use_case import GetMachineUseCase
from app.machines.use_cases.update_machines_use_case import UpdateMachineUseCase
from containers import Container
from infrastructure.logger import Logger

router = APIRouter()

@router.post("/machines", tags=["Machines"], response_model=CreateMachinesSchema)
@inject
async def create_form(
    machine_data: CreateMachinesSchema,
    create_machine_use_case: CreateMachineUseCase = Depends(Provide[Container.create_machine_use_case]),
    logger: Logger = Depends(Provide[Container.logger])    
):
    await create_machine_use_case.run(machine_data)
    return JSONResponse(
        content={"message": "Auth", "detail": 'data'}
    )

@router.put("/machines/{machines_id}", tags=["Machines"], response_model=UpdateMachinesSchema)
@inject
async def update_machine(
    machine_id: str,
    form_data: UpdateMachinesSchema,
    update_machine_use_case: UpdateMachineUseCase = Depends(Provide[Container.update_machine_use_case]),
    logger: Logger = Depends(Provide[Container.logger])
):
    updated_form = await update_machine_use_case.run(machine_id, form_data)
    if not updated_form:
        raise HTTPException(status_code=404, detail="Form not found or not updated")
    return {"message": "Form updated successfully"}

@router.get("/machines/{machine_id}", tags=["Machines"], response_class=GetMachineUseCase)
@inject
async def get_machine(
    machine_id: str,
    get_machine_use_case: GetMachineUseCase = Depends(Provide[Container.get_machine_use_case]),
    logger: Logger = Depends(Provide[Container.logger])
):
    machine = await get_machine_use_case.run(machine_id)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine

@router.delete("/machines/{machine_id}", tags=["Machines"], response_class=DeleteMachineUseCase)
@inject
async def delete_machine(
    machine_id: str,
    delete_machine_use_case: DeleteMachineUseCase = Depends(Provide[Container.delete_form_use_case]),
    logger: Logger = Depends(Provide[Container.logger])
):
    deleted = await delete_machine_use_case.run(machine_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Form not found or not deleted")
    return {"message": "Macchine deleted successfully"}


@router.get("/machines", tags=["Machines"])
@inject
async def list_machines(
    request: Request,
    start_date: str = Query(...),
    end_date: str = Query(...),
    limit: Optional[int] = Query(100),
    offset: Optional[int] = Query(0),
    get_all_machines_use_case: GetAllMachineUseCase = Depends(Provide[Container.get_all_machines_use_case]),
    logger: Logger = Depends(Provide[Container.logger])
):
    machines_list = await get_all_machines_use_case.run(start_date=start_date, end_date=end_date, limit=limit, offset=offset)
    return machines_list
def configure(app: FastAPI):
    app.include_router(router)
