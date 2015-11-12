<?php

class locks {

	public static function lock($objectID, $type) {

		if (self::is_locked($objectID,$type)) {
			errorHandle::errorMsg("Object already locked.");
			return FALSE;
		}

		$sql       = sprintf("INSERT INTO `locks` (`type`,`typeID`,`user`,`date`) VALUES('%s','%s','%s','%s')",
			mfcs::$engine->openDB->escape($type),
			mfcs::$engine->openDB->escape($objectID),
			mfcs::$engine->openDB->escape(users::user('ID')),
			time()
			);
		$sqlResult = mfcs::$engine->openDB->query($sql);
		
		if (!$sqlResult['result']) {
			errorHandle::newError(__METHOD__."() - : ".$sqlResult['error'], errorHandle::DEBUG);
			return FALSE;
		}
		
		localvars::add("lockID",$sqlResult['id']);

		return $sqlResult['id'];

	}

	public static function unlock($objectID, $type) {

		$sql       = sprintf("DELETE FROM `locks` WHERE `type`='%s' AND `typeID`='%s'",
			mfcs::$engine->openDB->escape($type),
			mfcs::$engine->openDB->escape($objectID)
			);
		$sqlResult = mfcs::$engine->openDB->query($sql);
		
		if (!$sqlResult['result']) {
			errorHandle::newError(__METHOD__."() - unlocking object: ".$sqlResult['error'], errorHandle::DEBUG);
			return FALSE;
		}
		
		return TRUE;

	}

	public static function is_locked($objectID, $type) {

		$sql       = sprintf("SELECT COUNT(*) from `locks` WHERE `type`='%s' AND `typeID`='%s'",
			mfcs::$engine->openDB->escape($type),
			mfcs::$engine->openDB->escape($objectID)
			);
		$sqlResult = mfcs::$engine->openDB->query($sql);
		
		if (!$sqlResult['result']) {
			errorHandle::newError(__METHOD__."() - : ".$sqlResult['error'], errorHandle::DEBUG);
			return FALSE;
		}
		
		$row = mysql_fetch_array($sqlResult['result'],  MYSQL_ASSOC);

		if ($row["COUNT(*)"] != 0) {
			return TRUE;
			localvars::add("lockUsername",$row['username']);
			localvars::add("lockDate",date("D,  M d Y H:i",$row['date']));
		}

		return FALSE;

	}

}
?>